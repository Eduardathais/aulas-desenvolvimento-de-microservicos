import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { AttendanceHateoasPresenter } from "@attendance/infra/presenters/attendance-hateoas.presenter";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { getApiBaseUrl } from "@shared/infra/hypermedia/base-url";
import type { Request } from "express";

@Controller("attendances")
export class AttendancesController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly hateoas: AttendanceHateoasPresenter,
  ) {}

  @Get("student/:studentId/class-offering/:classOfferingId")
  async findByStudent(
    @Req() req: Request,
    @Param("studentId") studentId: string,
    @Param("classOfferingId") classOfferingId: string,
  ) {
    const baseUrl = getApiBaseUrl(req);
    const items = await this.attendanceService.findByStudentAndClassOffering(
      studentId,
      classOfferingId,
    );
    return this.hateoas.wrapCollectionByStudentAndClassOffering(
      baseUrl,
      studentId,
      classOfferingId,
      items,
    );
  }

  @Get("class-offering/:classOfferingId")
  async findByClassOffering(
    @Req() req: Request,
    @Param("classOfferingId") classOfferingId: string,
  ) {
    const baseUrl = getApiBaseUrl(req);
    const items =
      await this.attendanceService.findByClassOffering(classOfferingId);
    return this.hateoas.wrapCollectionByClassOffering(
      baseUrl,
      classOfferingId,
      items,
    );
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
    await this.attendanceService.register(body);
    return this.hateoas.registrationResult(getApiBaseUrl(req), body);
  }
}
