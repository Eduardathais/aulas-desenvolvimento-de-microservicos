import type { Attendance } from "@attendance/domain/models/attendance.entity";
import { ApiProperty } from "@nestjs/swagger";

export class AttendanceDto {
  @ApiProperty({
    required: false,
    nullable: true,
    example: "f0000006-0000-0000-0000-000000000001",
  })
  id: string | undefined;

  @ApiProperty({ example: "c0000003-0000-0000-0000-000000000001" })
  studentId: string;

  @ApiProperty({ example: "f1000000-0000-0000-0000-000000000001" })
  lessonId: string;

  @ApiProperty({ example: "d0000004-0000-0000-0000-000000000001" })
  classOfferingId: string;

  @ApiProperty({ example: "present", enum: ["present", "absent"] })
  status: string;

  private constructor(
    id: string | undefined,
    studentId: string,
    lessonId: string,
    classOfferingId: string,
    status: string,
  ) {
    this.id = id;
    this.studentId = studentId;
    this.lessonId = lessonId;
    this.classOfferingId = classOfferingId;
    this.status = status;
  }

  public static from(attendance: Attendance | null): AttendanceDto | null {
    if (!attendance) return null;
    return new AttendanceDto(
      attendance.id,
      attendance.studentId,
      attendance.lessonId,
      attendance.classOfferingId,
      attendance.status,
    );
  }
}
