import { Controller } from '@nestjs/common';
import { Admin, AdminsMicroserviceConstants, AdminUpdatePasswordDto, FindOneByIdDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminsService } from '../services/admins.service';
import { FindOneByEmailDto } from '@app/common/dtos/find-one-by-email.dto';

const VERSION = '1';

@Controller()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_EMAIL}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneByEmail(findOneByEmailDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_UPDATE_PASSWORD}/v${VERSION}`,
  })
  updatePassword(@Payload() adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin> {
    return this.adminsService.updatePassword(adminUpdatePasswordDto);
  }
}
