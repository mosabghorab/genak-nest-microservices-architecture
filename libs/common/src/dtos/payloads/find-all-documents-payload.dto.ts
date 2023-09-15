import { ServiceType } from '@app/common/enums';

export class FindAllDocumentsPayloadDto {
  serviceType: ServiceType;
  active?: boolean;

  constructor(data: { serviceType: ServiceType; active?: boolean }) {
    Object.assign(this, data);
  }
}
