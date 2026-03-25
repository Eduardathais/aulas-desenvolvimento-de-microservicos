import type { AttendanceDto } from "@attendance/application/dto/attendance.dto";
import { Injectable } from "@nestjs/common";

/** Link no estilo HAL (RFC 5988 + extensões comuns para método e tipo). */
export type HalLink = {
  href: string;
  title?: string;
  method?: string;
  type?: string;
};

export type HalLinks = Record<string, HalLink>;

@Injectable()
export class AttendanceHateoasPresenter {
  private attendancesRoot(baseUrl: string): string {
    return `${baseUrl}/attendances`;
  }

  wrapCollectionByStudentAndClassOffering(
    baseUrl: string,
    studentId: string,
    classOfferingId: string,
    items: AttendanceDto[],
  ) {
    const root = this.attendancesRoot(baseUrl);
    const selfHref = `${root}/student/${studentId}/class-offering/${classOfferingId}`;

    return {
      _links: {
        self: { href: selfHref, title: "This collection" },
        "attendances-by-class-offering": {
          href: `${root}/class-offering/${classOfferingId}`,
          title: "All attendances for this class offering",
        },
        register: {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register a new attendance",
        },
      } satisfies HalLinks,
      attendances: items.map((item) => this.embedAttendance(baseUrl, item)),
    };
  }

  wrapCollectionByClassOffering(
    baseUrl: string,
    classOfferingId: string,
    items: AttendanceDto[],
  ) {
    const root = this.attendancesRoot(baseUrl);
    const selfHref = `${root}/class-offering/${classOfferingId}`;

    return {
      _links: {
        self: { href: selfHref, title: "This collection" },
        register: {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register a new attendance",
        },
      } satisfies HalLinks,
      attendances: items.map((item) => this.embedAttendance(baseUrl, item)),
    };
  }

  registrationResult(
    baseUrl: string,
    body: { studentId: string; classOfferingId: string },
  ) {
    const root = this.attendancesRoot(baseUrl);
    return {
      _links: {
        self: { href: root, title: "Attendances collection" },
        "attendances-for-student-in-offering": {
          href: `${root}/student/${body.studentId}/class-offering/${body.classOfferingId}`,
          title: "Attendances for this student in this offering",
        },
        "attendances-by-class-offering": {
          href: `${root}/class-offering/${body.classOfferingId}`,
          title: "All attendances for this class offering",
        },
      } satisfies HalLinks,
    };
  }

  private embedAttendance(baseUrl: string, item: AttendanceDto) {
    const root = this.attendancesRoot(baseUrl);
    return {
      id: item.id,
      studentId: item.studentId,
      lessonId: item.lessonId,
      classOfferingId: item.classOfferingId,
      status: item.status,
      _links: {
        self: {
          href: `${root}/student/${item.studentId}/class-offering/${item.classOfferingId}`,
          title: "Student attendances in this offering",
        },
        "attendances-by-class-offering": {
          href: `${root}/class-offering/${item.classOfferingId}`,
          title: "All attendances for this class offering",
        },
        register: {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register attendance",
        },
      } satisfies HalLinks,
    };
  }
}
