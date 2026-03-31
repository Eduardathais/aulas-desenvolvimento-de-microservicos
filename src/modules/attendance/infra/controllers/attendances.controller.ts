import { AttendanceDto } from "@attendance/application/dto/attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { HateoasItem, HateoasList, type LinksMap } from "@shared/infra/hateoas";
import { getApiBaseUrl } from "@shared/infra/hypermedia/base-url";
import type { Request } from "express";

const ATTENDANCES = "/v1/attendances";

function attendanceItemLinks(item: AttendanceDto): LinksMap {
  const id = item.id;
  if (!id) {
    return {
      "attendance:create": { href: ATTENDANCES, method: "POST" },
    };
  }

  return {
    self: { href: `${ATTENDANCES}/${id}`, method: "GET" },
    update: { href: `${ATTENDANCES}/${id}`, method: "PUT" },
    delete: { href: `${ATTENDANCES}/${id}`, method: "DELETE" },
    "attendances:by-class-offering": {
      href: `${ATTENDANCES}?class_offering_id=${item.classOfferingId}`,
      method: "GET",
    },
    "attendances:by-student-and-class-offering": {
      href: `${ATTENDANCES}?class_offering_id=${item.classOfferingId}&student_id=${item.studentId}`,
      method: "GET",
    },
    "attendance:create": { href: ATTENDANCES, method: "POST" },
  };
}

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @HateoasList<AttendanceDto>({
    itemLinks: attendanceItemLinks,
  })
  async findAll(
    @Query("class_offering_id") classOfferingId: string | undefined,
    @Query("student_id") studentId: string | undefined,
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    if (!classOfferingId?.trim()) {
      throw new BadRequestException("class_offering_id is required");
    }

    return this.attendanceService.findAllPaginated({
      classOfferingId: classOfferingId,
      studentId: studentId?.trim() || undefined,
      page,
      size,
    });
  }

  @Get(":id")
  @HateoasItem<AttendanceDto>({
    basePath: ATTENDANCES,
    itemLinks: attendanceItemLinks,
  })
  async findById(@Param("id") id: string) {
    return this.attendanceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Req() req: Request,
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    const created = await this.attendanceService.register(body);
    req.res?.setHeader(
      "Location",
      `${getApiBaseUrl(req)}${ATTENDANCES}/${created.id}`,
    );
    return created;
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateById(
    @Param("id") id: string,
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    await this.attendanceService.updateById(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.attendanceService.deleteById(id);
  }
}
