import { AttendanceDto } from "@attendance/application/dto/attendance.dto";
import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import {
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

function attendanceItemLinks(item: AttendanceDto): LinksMap {
  const id = item.id;
  if (!id) {
    return {
      "attendance:create": { href: "/attendances", method: "POST" },
    };
  }

  return {
    self: { href: `/attendances/${id}`, method: "GET" },
    update: { href: `/attendances/${id}`, method: "PUT" },
    delete: { href: `/attendances/${id}`, method: "DELETE" },
    "attendances:by-class-offering": {
      href: `/attendances/class-offering/${item.classOfferingId}`,
      method: "GET",
    },
    "attendances:by-student-and-class-offering": {
      href: `/attendances/student/${item.studentId}/class-offering/${item.classOfferingId}`,
      method: "GET",
    },
    "attendance:create": { href: "/attendances", method: "POST" },
  };
}

@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("student/:studentId/class-offering/:classOfferingId")
  @HateoasList<AttendanceDto>({
    itemLinks: attendanceItemLinks,
  })
  async findByStudent(
    @Param("studentId") studentId: string,
    @Param("classOfferingId") classOfferingId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.attendanceService.findByStudentAndClassOfferingPaginated(
      studentId,
      classOfferingId,
      page,
      limit,
    );
  }

  @Get("class-offering/:classOfferingId")
  @HateoasList<AttendanceDto>({
    itemLinks: attendanceItemLinks,
  })
  async findByClassOffering(
    @Param("classOfferingId") classOfferingId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.attendanceService.findByClassOfferingPaginated(
      classOfferingId,
      page,
      limit,
    );
  }

  @Get(":id")
  @HateoasItem<AttendanceDto>({
    basePath: "/attendances",
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
      `${getApiBaseUrl(req)}/attendances/${created.id}`,
    );
    return created;
  }

  @Put(":id")
  async updateById(
    @Param("id") id: string,
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    return this.attendanceService.updateById(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.attendanceService.deleteById(id);
  }
}
