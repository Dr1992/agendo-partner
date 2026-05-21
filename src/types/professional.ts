export type StaffRole = "OWNER" | "MANAGER" | "STAFF";

export type Professional = {
  id: string;
  name: string;
  title?: string;
  /** Preenchido na API parceiro (gestão) */
  staffRole?: StaffRole;
};
