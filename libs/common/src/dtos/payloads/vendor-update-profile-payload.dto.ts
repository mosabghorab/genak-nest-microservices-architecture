export class VendorUpdateProfilePayloadDto {
  vendorId: number;
  name?: string;
  commercialName?: string;
  phone?: string;
  notificationsEnabled?: boolean;
  available?: boolean;
  avatar?: Express.Multer.File;

  constructor(data: { vendorId: number; name?: string; commercialName?: string; phone?: string; notificationsEnabled?: boolean; available?: boolean; avatar?: Express.Multer.File }) {
    Object.assign(this, data);
  }
}
