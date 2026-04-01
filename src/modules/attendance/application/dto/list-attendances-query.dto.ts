import { ApiProperty } from "@nestjs/swagger";
import { trimString } from "@shared/infra/validation/trim-string.transform";
import { Transform } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class ListAttendancesQueryDto {
  @ApiProperty({
    name: "class_offering_id",
    format: "uuid",
    example: "d0000004-0000-0000-0000-000000000001",
  })
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  class_offering_id: string;

  @ApiProperty({
    name: "student_id",
    required: false,
    format: "uuid",
    example: "c0000003-0000-0000-0000-000000000001",
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === undefined || value === null) return undefined;
    return typeof value === "string" ? value.trim() : value;
  })
  @IsUUID("loose")
  student_id?: string;

  @ApiProperty({
    name: "_page",
    required: false,
    default: 1,
    minimum: 1,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return 1;
    const n = Number(value);
    return Number.isNaN(n) ? 1 : n;
  })
  @IsInt()
  @Min(1)
  _page: number;

  @ApiProperty({
    name: "_size",
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return 10;
    const n = Number(value);
    return Number.isNaN(n) ? 10 : n;
  })
  @IsInt()
  @Min(1)
  @Max(100)
  _size: number;
}
