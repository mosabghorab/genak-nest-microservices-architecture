export class AdminUpdateProfilePayloadDto {
  adminId: number;
  name?: string;
  email?: string;
  notificationsEnabled?: boolean;

  constructor(data: { adminId: number; name?: string; email?: string; notificationsEnabled?: boolean }) {
    Object.assign(this, data);
  }
}
