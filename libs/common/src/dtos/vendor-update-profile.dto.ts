export class VendorUpdateProfileDto {
  vendorId: number;

  name?: string;

  commercialName?: string;

  phone?: string;

  notificationsEnabled?: boolean;

  available?: boolean;

  avatar?: Express.Multer.File;
}
