import { AttendanceService } from "@attendance/application/services/attendance.service";
import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { AttendanceHateoasPresenter } from "@attendance/infra/presenters/attendance-hateoas.presenter";
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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

  @Get(":id")
  async findById(@Req() req: Request, @Param("id") id: string) {
    const item = await this.attendanceService.findById(id);
    return this.hateoas.wrapOne(getApiBaseUrl(req), item);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header("Content-Type", "application/json")
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
    return this.hateoas.creationResult(getApiBaseUrl(req), created);
  }

  @Put(":id")
  async updateById(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() body: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ) {
    const item = await this.attendanceService.updateById(id, body);
    return this.hateoas.wrapOne(getApiBaseUrl(req), item);
  }

  @Delete(":id")
  async remove(@Req() req: Request, @Param("id") id: string) {
    const ctx = await this.attendanceService.deleteById(id);
    return this.hateoas.deletionResult(getApiBaseUrl(req), ctx);
  }
}
