export class CustomerSignUpPayloadDto {
  name: string;
  phone: string;
  governorateId: number;
  regionId: number;

  constructor(data: { name: string; phone: string; governorateId: number; regionId: number }) {
    Object.assign(this, data);
  }
}
