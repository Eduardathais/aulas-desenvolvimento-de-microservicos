import type { Attendance } from "@attendance/domain/models/attendance.entity";

export const ATTENDANCE_REPOSITORY = Symbol("ATTENDANCE_REPOSITORY");

export interface AttendanceRepository {
  create(attendance: Attendance): Promise<Attendance>;
  findById(id: string): Promise<Attendance | null>;
  updateById(
    id: string,
    data: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: Attendance["status"];
    },
  ): Promise<Attendance | null>;
  deleteById(id: string): Promise<Attendance | null>;
  findByStudentAndClassOffering(
    studentId: string,
    classOfferingId: string,
  ): Promise<Attendance[]>;
  findByClassOffering(classOfferingId: string): Promise<Attendance[]>;
}
