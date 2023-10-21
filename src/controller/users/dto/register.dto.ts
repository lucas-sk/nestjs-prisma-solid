import { IsEmail, IsString } from 'class-validator'

export class RegisterDto {
  @IsString()
  name: string

  @IsString()
  @IsEmail()
  email: string

  // @IsStrongPassword()
  @IsString()
  password: string
}
