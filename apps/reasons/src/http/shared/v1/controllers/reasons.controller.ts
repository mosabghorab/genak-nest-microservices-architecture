import { Controller, Get } from '@nestjs/common';
import { AllowFor, Reason, ReasonDto, Serialize, UserType } from '@app/common';
import { ReasonsService } from '../services/reasons.service';

@AllowFor(UserType.CUSTOMER, UserType.VENDOR)
@Controller({ path: 'reasons', version: '1' })
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll(): Promise<Reason[]> {
    return this.reasonsService.findAll();
  }
}
