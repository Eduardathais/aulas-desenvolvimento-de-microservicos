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
  ): Promise<AttendanceDto> {
    const record = await this.attendanceRepository.updateById(id, dto);
    if (!record) {
      throw new NotFoundException("Attendance not found");
    }

    return AttendanceDto.from(record)!;
  }

  async deleteById(id: string): Promise<{
    studentId: string;
    classOfferingId: string;
  }> {
    const deleted = await this.attendanceRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException("Attendance not found");
    }

    return {
      studentId: deleted.studentId,
      classOfferingId: deleted.classOfferingId,
    };
  }

  async findByStudentAndClassOffering(
    studentId: string,
    classOfferingId: string,
  ): Promise<AttendanceDto[]> {
    const records =
      await this.attendanceRepository.findByStudentAndClassOffering(
        studentId,
        classOfferingId,
      );
    return records.map((r) => AttendanceDto.from(r)!);
  }

  async findByClassOffering(classOfferingId: string): Promise<AttendanceDto[]> {
    const records =
      await this.attendanceRepository.findByClassOffering(classOfferingId);
    return records.map((r) => AttendanceDto.from(r)!);
  }
}
