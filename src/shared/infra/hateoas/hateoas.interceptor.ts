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

  private paginationHref(request: Request, page: number, size: number): string {
    const host = request.get("host") ?? "localhost";
    const base = `${request.protocol}://${host}`;
    const url = new URL(request.originalUrl, base);
    url.searchParams.set("_page", String(page));
    url.searchParams.set("_size", String(size));
    return `${url.pathname}${url.search}`;
  }

  private transformList(
    paginated: PaginatedResult<Record<string, unknown>>,
    options: HateoasListOptions,
    request: Request,
  ) {
    const { data, total, page, size } = paginated;
    const totalPages = size > 0 ? Math.ceil(total / size) : 1;

    const itemsWithLinks = data.map((item) => ({
      ...item,
      _links: options.itemLinks(item),
    }));

    return {
      data: itemsWithLinks,
      meta: {
        totalItems: total,
        itemsPerPage: size,
        currentPage: page,
        totalPages,
      },
      _links: {
        self: {
          href: this.paginationHref(request, page, size),
          method: "GET" as const,
        },
        next:
          page < totalPages
            ? {
                href: this.paginationHref(request, page + 1, size),
                method: "GET" as const,
              }
            : null,
        prev:
          page > 1
            ? {
                href: this.paginationHref(request, page - 1, size),
                method: "GET" as const,
              }
            : null,
        first: {
          href: this.paginationHref(request, 1, size),
          method: "GET" as const,
        },
        last: {
          href: this.paginationHref(request, totalPages, size),
          method: "GET" as const,
        },
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
