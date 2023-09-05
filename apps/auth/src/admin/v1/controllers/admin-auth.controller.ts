import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Admin, AdminDto, AllowFor, AuthedUser, GetAuthedUser, Public, Serialize, UserType } from '@app/common';
import { AdminAuthService } from '../services/admin-auth.service';
import { SignInWithEmailAndPasswordDto } from '../dtos/sign-in-with-email-and-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@Controller({ path: 'admin/auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Serialize(AdminDto, 'You signed in successfully.')
  @Post('sign-in-with-email-and-password')
  signInWithEmailAndPassword(@Body() signInWithEmailAndPasswordDto: SignInWithEmailAndPasswordDto): Promise<any> {
    return this.adminAuthService.signInWithEmailAndPassword(signInWithEmailAndPasswordDto);
  }

  @AllowFor(UserType.ADMIN)
  @Serialize(AdminDto, 'Password changed successfully.')
  @Patch('change-password')
  changePassword(@GetAuthedUser() authedUser: AuthedUser, @Body() changePasswordDto: ChangePasswordDto): Promise<Admin> {
    return this.adminAuthService.changePassword(authedUser.id, changePasswordDto);
  }
}
