export class CustomerUpdateProfilePayloadDto {
  customerId: number;
  name?: string;
  phone?: string;
  notificationsEnabled?: boolean;
  governorateId: number;
  regionId: number;

  constructor(data: { customerId: number; name?: string; phone?: string; notificationsEnabled?: boolean; governorateId: number; regionId: number }) {
    Object.assign(this, data);
  }
}
