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
      attendances: items.map((item) => this.collectionItem(item)),
      _links: {
        self: { href: selfHref, title: "This collection" },
        "attendances:by-class-offering": {
          href: `${root}/class-offering/${classOfferingId}`,
          title: "All attendances for this class offering",
        },
        "attendance:create": {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register a new attendance",
        },
      } satisfies HalLinks,
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
      attendances: items.map((item) => this.collectionItem(item)),
      _links: {
        self: { href: selfHref, title: "This collection" },
        "attendance:by-id": {
          href: `${root}/{attendanceId}`,
          title: "Get one attendance by id",
        },
        "attendance:create": {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register a new attendance",
        },
      } satisfies HalLinks,
    };
  }

  creationResult(baseUrl: string, item: AttendanceDto) {
    return this.embedAttendance(baseUrl, item);
  }

  wrapOne(baseUrl: string, item: AttendanceDto) {
    return this.embedAttendance(baseUrl, item);
  }

  deletionResult(
    baseUrl: string,
    body: { studentId: string; classOfferingId: string },
  ) {
    const root = this.attendancesRoot(baseUrl);
    return {
      studentId: body.studentId,
      classOfferingId: body.classOfferingId,
      _links: {
        self: { href: root, title: "Attendances collection" },
        "attendances:by-student-and-class-offering": {
          href: `${root}/student/${body.studentId}/class-offering/${body.classOfferingId}`,
          title: "Attendances for this student in this offering",
        },
        "attendances:by-class-offering": {
          href: `${root}/class-offering/${body.classOfferingId}`,
          title: "All attendances for this class offering",
        },
        "attendance:create": {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register a new attendance",
        },
      } satisfies HalLinks,
    };
  }

  private embedAttendance(baseUrl: string, item: AttendanceDto) {
    const root = this.attendancesRoot(baseUrl);
    const attendanceId = item.id ?? "{attendanceId}";
    return {
      id: item.id,
      studentId: item.studentId,
      lessonId: item.lessonId,
      classOfferingId: item.classOfferingId,
      status: item.status,
      _links: {
        self: {
          href: `${root}/${attendanceId}`,
          title: "Get this attendance",
        },
        "attendances:by-class-offering": {
          href: `${root}/class-offering/${item.classOfferingId}`,
          title: "All attendances for this class offering",
        },
        "attendances:by-student-and-class-offering": {
          href: `${root}/student/${item.studentId}/class-offering/${item.classOfferingId}`,
          title: "Attendances for this student in this offering",
        },
        "attendance:update": {
          href: `${root}/${attendanceId}`,
          method: "PUT",
          type: "application/json",
          title: "Update this attendance",
        },
        "attendance:delete": {
          href: `${root}/${attendanceId}`,
          method: "DELETE",
          title: "Delete this attendance",
        },
        "attendance:create": {
          href: root,
          method: "POST",
          type: "application/json",
          title: "Register attendance",
        },
      } satisfies HalLinks,
    };
  }

  private collectionItem(item: AttendanceDto) {
    return {
      id: item.id,
      studentId: item.studentId,
      lessonId: item.lessonId,
      classOfferingId: item.classOfferingId,
      status: item.status,
    };
  }
}
