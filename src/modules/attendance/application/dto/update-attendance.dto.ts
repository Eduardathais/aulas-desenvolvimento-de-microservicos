import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { trimString } from "@shared/infra/validation/trim-string.transform";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class UpdateAttendanceDto {
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  studentId: string;

  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  lessonId: string;

  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  classOfferingId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
