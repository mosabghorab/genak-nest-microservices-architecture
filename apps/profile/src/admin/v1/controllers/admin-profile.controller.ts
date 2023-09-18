import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Admin, AdminResponseDto, AllowFor, AuthedUser, GetAuthedUser, Serialize, SkipAdminRoles, UserType } from '@app/common';
import { AdminProfileService } from '../services/admin-profile.service';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

@AllowFor(UserType.ADMIN)
@SkipAdminRoles()
@Controller({ path: 'admin/profile', version: '1' })
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Serialize(AdminResponseDto, 'Profile updated successfully.')
  @Patch()
  update(@GetAuthedUser() authedUser: AuthedUser, @Body() updateProfileRequestDto: UpdateProfileRequestDto): Promise<Admin> {
    return this.adminProfileService.update(authedUser, updateProfileRequestDto);
  }

  @Serialize(AdminResponseDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Admin> {
    return this.adminProfileService.find(authedUser);
  }
}
