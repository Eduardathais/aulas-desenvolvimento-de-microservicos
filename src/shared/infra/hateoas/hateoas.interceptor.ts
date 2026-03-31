import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { PaginatedResult } from "./hateoas.types";
import {
  HATEOAS_ITEM_KEY,
  type HateoasItemOptions,
} from "./hateoas-item.decorator";
import {
  HATEOAS_LIST_KEY,
  type HateoasListOptions,
} from "./hateoas-list.decorator";

@Injectable()
export class HateoasInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const listOptions = this.reflector.get<HateoasListOptions | undefined>(
      HATEOAS_LIST_KEY,
      context.getHandler(),
    );
    const itemOptions = this.reflector.get<HateoasItemOptions | undefined>(
      HATEOAS_ITEM_KEY,
      context.getHandler(),
    );

    if (!listOptions && !itemOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (listOptions) {
          return this.transformList(
            data as PaginatedResult<Record<string, unknown>>,
            listOptions,
            request,
          );
        }
        return this.transformItem(
          data as Record<string, unknown> | null,
          itemOptions!,
        );
      }),
    );
  }

  private transformList(
    paginated: PaginatedResult<Record<string, unknown>>,
    options: HateoasListOptions,
    request: Request,
  ) {
    const { data, total, page, limit } = paginated;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    const basePath = options.basePath ?? request.path;

    const itemsWithLinks = data.map((item) => ({
      ...item,
      _links: options.itemLinks(item),
    }));

    return {
      data: itemsWithLinks,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      },
      _links: {
        self: {
          href: `${basePath}?page=${page}&limit=${limit}`,
          method: "GET" as const,
        },
        next:
          page < totalPages
            ? {
                href: `${basePath}?page=${page + 1}&limit=${limit}`,
                method: "GET" as const,
              }
            : null,
        prev:
          page > 1
            ? {
                href: `${basePath}?page=${page - 1}&limit=${limit}`,
                method: "GET" as const,
              }
            : null,
        first: { href: `${basePath}?page=1&limit=${limit}`, method: "GET" },
        last: {
          href: `${basePath}?page=${totalPages}&limit=${limit}`,
          method: "GET",
        },
        create: { href: basePath, method: "POST" },
      },
    };
  }

  private transformItem(
    item: Record<string, unknown> | null,
    options: HateoasItemOptions,
  ) {
    if (!item) return null;
    return {
      ...item,
      _links: options.itemLinks(item),
    };
  }
}
