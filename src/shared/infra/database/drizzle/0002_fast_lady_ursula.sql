ALTER TABLE "students" DROP CONSTRAINT "students_email_unique";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_document_unique";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_registration_unique";--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_code_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_email_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_document_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_teacher_id_teachers_id_fk";
--> statement-breakpoint
ALTER TABLE "attendances" ADD COLUMN "teacher_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "document";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "registration";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "workload";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "document";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "degree";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "specialization";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "admission_date";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "subject_id";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "class_offerings" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "student_id";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "class_offering_id";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "enrolled_at";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "canceled_at";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "enrollments" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "teacher_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "permissions";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";--> statement-breakpoint
DROP TYPE "public"."class_offering_status";--> statement-breakpoint
DROP TYPE "public"."enrollment_status";