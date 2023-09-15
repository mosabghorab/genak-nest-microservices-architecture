export class AdminUpdatePasswordPayloadDto {
  adminId: number;
  newPassword: string;

  constructor(data: { adminId: number; newPassword: string }) {
    Object.assign(this, data);
  }
}
