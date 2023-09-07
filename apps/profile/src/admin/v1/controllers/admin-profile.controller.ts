import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Admin, AdminDto, AllowFor, AuthedUser, GetAuthedUser, Serialize, SkipAdminRoles, UserType } from '@app/common';
import { AdminProfileService } from '../services/admin-profile.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@AllowFor(UserType.ADMIN)
@SkipAdminRoles()
@Controller({ path: 'admin/profile', version: '1' })
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Serialize(AdminDto, 'Profile updated successfully.')
  @Patch()
  update(@GetAuthedUser() authedUser: AuthedUser, @Body() updateProfileDto: UpdateProfileDto): Promise<Admin> {
    return this.adminProfileService.update(authedUser.id, updateProfileDto);
  }

  @Serialize(AdminDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Admin> {
    return this.adminProfileService.find(authedUser.id);
  }
}
