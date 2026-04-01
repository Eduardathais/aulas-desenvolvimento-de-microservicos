import { AttendanceDto } from "@attendance/application/dto/attendance.dto";
import { CreateAttendanceDto } from "@attendance/application/dto/create-attendance.dto";
import { ListAttendancesQueryDto } from "@attendance/application/dto/list-attendances-query.dto";
import { UpdateAttendanceDto } from "@attendance/application/dto/update-attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  async findAll(@Query() query: ListAttendancesQueryDto) {
    return this.attendanceService.findAllPaginated({
      classOfferingId: query.class_offering_id,
      studentId: query.student_id,
      page: query._page,
      size: query._size,
    });
  }

  @Get(":id")
  @HateoasItem<AttendanceDto>({
    basePath: ATTENDANCES,
    itemLinks: attendanceItemLinks,
  })
  async findById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.attendanceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Req() req: Request, @Body() body: CreateAttendanceDto) {
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
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAttendanceDto,
  ) {
    await this.attendanceService.updateById(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.attendanceService.deleteById(id);
  }
}
