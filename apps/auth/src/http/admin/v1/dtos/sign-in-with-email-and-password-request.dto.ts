import { IsEmail, IsString } from 'class-validator';

export class SignInWithEmailAndPasswordRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fcmToken: string;
}
