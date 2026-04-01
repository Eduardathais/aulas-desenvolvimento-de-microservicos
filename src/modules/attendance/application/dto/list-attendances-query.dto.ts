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
  @Transform(trimString)
  @IsUUID("loose")
  @IsNotEmpty()
  class_offering_id: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "" || value === undefined || value === null) return undefined;
    return typeof value === "string" ? value.trim() : value;
  })
  @IsUUID("loose")
  student_id?: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return 1;
    const n = Number(value);
    return Number.isNaN(n) ? 1 : n;
  })
  @IsInt()
  @Min(1)
  _page: number;

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
