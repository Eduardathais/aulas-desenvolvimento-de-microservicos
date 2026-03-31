import { AttendanceDto } from "@attendance/application/dto/attendance.dto";
import {
  Attendance,
  AttendanceStatus,
} from "@attendance/domain/models/attendance.entity";
import {
  ATTENDANCE_REPOSITORY,
  type AttendanceRepository,
} from "@attendance/domain/repositories/attendance-repository.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResult } from "@shared/infra/hateoas";

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async register(dto: {
    studentId: string;
    lessonId: string;
    classOfferingId: string;
    status: AttendanceStatus;
  }): Promise<AttendanceDto> {
    const attendance = Attendance.restore(dto);
    const created = await this.attendanceRepository.create(attendance!);
    return AttendanceDto.from(created)!;
  }

  async findById(id: string): Promise<AttendanceDto> {
    const record = await this.attendanceRepository.findById(id);
    if (!record) {
      throw new NotFoundException("Attendance not found");
    }

    return AttendanceDto.from(record)!;
  }

  async updateById(
    id: string,
    dto: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: AttendanceStatus;
    },
  ): Promise<void> {
    const record = await this.attendanceRepository.updateById(id, dto);
    if (!record) {
      throw new NotFoundException("Attendance not found");
    }
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await this.attendanceRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException("Attendance not found");
    }
  }

  async findAllPaginated(params: {
    classOfferingId: string;
    studentId?: string;
    page: number;
    size: number;
  }): Promise<PaginatedResult<AttendanceDto>> {
    const { classOfferingId, studentId, page, size } = params;
    const offset = (page - 1) * size;

    if (studentId) {
      const total =
        await this.attendanceRepository.countByStudentAndClassOffering(
          studentId,
          classOfferingId,
        );
      const records =
        await this.attendanceRepository.findByStudentAndClassOfferingPage(
          studentId,
          classOfferingId,
          offset,
          size,
        );
      return {
        data: records.map((r) => AttendanceDto.from(r)!),
        total,
        page,
        size,
      };
    }

    const total =
      await this.attendanceRepository.countByClassOffering(classOfferingId);
    const records = await this.attendanceRepository.findByClassOfferingPage(
      classOfferingId,
      offset,
      size,
    );
    return {
      data: records.map((r) => AttendanceDto.from(r)!),
      total,
      page,
      size,
    };
  }
}
