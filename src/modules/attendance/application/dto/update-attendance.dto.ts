import { AttendanceStatus } from "@attendance/domain/models/attendance.entity";
import { ApiProperty } from "@nestjs/swagger";
import { trimString } from "@shared/infra/validation/trim-string.transform";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";

export class UpdateAttendanceDto {
  @ApiProperty({
    format: "uuid",
    example: "c0000003-0000-0000-0000-000000000001",
  })
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    format: "uuid",
    example: "f1000000-0000-0000-0000-000000000001",
  })
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    format: "uuid",
    example: "d0000004-0000-0000-0000-000000000001",
  })
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  classOfferingId: string;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
