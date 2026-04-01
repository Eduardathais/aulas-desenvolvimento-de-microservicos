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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
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

@ApiTags("attendances")
@Controller("attendances")
export class AttendancesController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @HateoasList<AttendanceDto>({
    itemLinks: attendanceItemLinks,
  })
  @ApiOperation({ summary: "Listar presenças (filtros e paginação)" })
  @ApiQuery({
    name: "class_offering_id",
    required: true,
    type: String,
    description: "UUID da oferta de disciplina",
  })
  @ApiQuery({
    name: "student_id",
    required: false,
    type: String,
    description: "UUID do aluno (filtro opcional)",
  })
  @ApiQuery({
    name: "_page",
    required: false,
    type: Number,
    description: "Página (padrão 1)",
  })
  @ApiQuery({
    name: "_size",
    required: false,
    type: Number,
    description: "Itens por página (padrão 10, máx. 100)",
  })
  @ApiOkResponse({
    description:
      "Lista paginada com data, meta e _links (HATEOAS); cada item inclui _links",
  })
  @ApiBadRequestResponse({ description: "Parâmetros inválidos ou faltando" })
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
  @ApiOperation({ summary: "Buscar presença por ID" })
  @ApiParam({ name: "id", format: "uuid", description: "UUID da presença" })
  @ApiOkResponse({
    type: AttendanceDto,
    description: "Recurso com _links (HATEOAS)",
  })
  @ApiNotFoundResponse({ description: "Presença não encontrada" })
  @ApiBadRequestResponse({ description: "ID inválido" })
  async findById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.attendanceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Registrar presença",
    description: "Resposta inclui header Location com o URI do recurso criado",
  })
  @ApiCreatedResponse({ type: AttendanceDto })
  @ApiBadRequestResponse({ description: "Body inválido" })
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
  @ApiOperation({ summary: "Atualizar presença" })
  @ApiParam({ name: "id", format: "uuid", description: "UUID da presença" })
  @ApiNoContentResponse({ description: "Presença atualizada" })
  @ApiNotFoundResponse({ description: "Presença não encontrada" })
  @ApiBadRequestResponse({ description: "Body ou ID inválido" })
  async updateById(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAttendanceDto,
  ) {
    await this.attendanceService.updateById(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover presença" })
  @ApiParam({ name: "id", format: "uuid", description: "UUID da presença" })
  @ApiNoContentResponse({ description: "Presença removida" })
  @ApiNotFoundResponse({ description: "Presença não encontrada" })
  @ApiBadRequestResponse({ description: "ID inválido" })
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.attendanceService.deleteById(id);
  }
}
