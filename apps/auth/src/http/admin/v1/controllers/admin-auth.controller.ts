import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Admin, AdminResponseDto, AllowFor, AuthedUser, GetAuthedUser, Public, Serialize, UserType } from '@app/common';
import { AdminAuthService } from '../services/admin-auth.service';
import { SignInWithEmailAndPasswordRequestDto } from '../dtos/sign-in-with-email-and-password-request.dto';
import { ChangePasswordRequestDto } from '../dtos/change-password-request.dto';

@Controller({ path: 'admin/auth', version: '1' })
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Serialize(AdminResponseDto, 'You signed in successfully.')
  @Post('sign-in-with-email-and-password')
  signInWithEmailAndPassword(@Body() signInWithEmailAndPasswordRequestDto: SignInWithEmailAndPasswordRequestDto): Promise<any> {
    return this.adminAuthService.signInWithEmailAndPassword(signInWithEmailAndPasswordRequestDto);
  }

  @AllowFor(UserType.ADMIN)
  @Serialize(AdminResponseDto, 'Password changed successfully.')
  @Patch('change-password')
  changePassword(@GetAuthedUser() authedUser: AuthedUser, @Body() changePasswordRequestDto: ChangePasswordRequestDto): Promise<Admin> {
    return this.adminAuthService.changePassword(authedUser, changePasswordRequestDto);
  }
}
