import { ServiceType } from '@app/common/enums';

export class VendorSignUpPayloadDto {
  serviceType: ServiceType;
  name: string;
  commercialName: string;
  phone: string;
  governorateId: number;
  maxProducts: number;

  constructor(data: { serviceType: ServiceType; name: string; commercialName: string; phone: string; governorateId: number; maxProducts: number }) {
    Object.assign(this, data);
  }
}
