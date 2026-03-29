import {
  Attendance,
  AttendanceStatus,
} from "@attendance/domain/models/attendance.entity";
import type { AttendanceRepository } from "@attendance/domain/repositories/attendance-repository.interface";
import { attendancesSchema } from "@attendance/infra/schemas/attendance.schema";
import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, eq } from "drizzle-orm";

@Injectable()
export class DrizzleAttendanceRepository implements AttendanceRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(attendance: Attendance): Promise<Attendance> {
    const rows = await this.drizzleService.db
      .insert(attendancesSchema)
      .values({
        studentId: attendance.studentId,
        lessonId: attendance.lessonId,
        classOfferingId: attendance.classOfferingId,
        status: attendance.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    const row = rows[0];
    return Attendance.restore({
      ...row,
      status: row.status as AttendanceStatus,
    })!;
  }

  async findByStudentAndClassOffering(
    studentId: string,
    classOfferingId: string,
  ): Promise<Attendance[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(attendancesSchema)
      .where(
        and(
          eq(attendancesSchema.studentId, studentId),
          eq(attendancesSchema.classOfferingId, classOfferingId),
        ),
      );

    return rows.map(
      (row) =>
        Attendance.restore({
          ...row,
          status: row.status as AttendanceStatus,
        })!,
    );
  }

  async findByClassOffering(classOfferingId: string): Promise<Attendance[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(attendancesSchema)
      .where(eq(attendancesSchema.classOfferingId, classOfferingId));

    return rows.map(
      (row) =>
        Attendance.restore({
          ...row,
          status: row.status as AttendanceStatus,
        })!,
    );
  }

  async findById(id: string): Promise<Attendance | null> {
    const rows = await this.drizzleService.db
      .select()
      .from(attendancesSchema)
      .where(eq(attendancesSchema.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return Attendance.restore({
      ...row,
      status: row.status as AttendanceStatus,
    });
  }

  async updateById(
    id: string,
    data: {
      studentId: string;
      lessonId: string;
      classOfferingId: string;
      status: Attendance["status"];
    },
  ): Promise<Attendance | null> {
    const rows = await this.drizzleService.db
      .update(attendancesSchema)
      .set({
        studentId: data.studentId,
        lessonId: data.lessonId,
        classOfferingId: data.classOfferingId,
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(attendancesSchema.id, id))
      .returning();

    const row = rows[0];
    if (!row) return null;

    return Attendance.restore({
      ...row,
      status: row.status as AttendanceStatus,
    });
  }

  async deleteById(id: string): Promise<Attendance | null> {
    const rows = await this.drizzleService.db
      .delete(attendancesSchema)
      .where(eq(attendancesSchema.id, id))
      .returning();

    const row = rows[0];
    if (!row) return null;

    return Attendance.restore({
      ...row,
      status: row.status as AttendanceStatus,
    });
  }
}
