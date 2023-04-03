import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 32)
  @IsNotEmpty()
  password: string;
}