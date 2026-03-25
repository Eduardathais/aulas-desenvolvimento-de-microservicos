import {
  attendanceStatusEnum,
  attendancesSchema,
} from "@attendance/infra/schemas/attendance.schema";
import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

//import {  classOfferingStatusEnum,  classOfferingsSchema,} from "src/schemas/class-offering.schema";
//import {  enrollmentStatusEnum,  enrollmentsSchema,} from "src/schemas/enrollment.schema";
//import { subjectsSchema } from "src/schemas/subject.schema";
//import { studentsSchema } from "src/schemas/student.schema";
//import { teachersSchema } from "src/schemas/teacher.schema";
//import { usersSchema } from "src/schemas/user.schema";

const schema = {
  attendancesSchema,
  attendanceStatusEnum,
};

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly db;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
