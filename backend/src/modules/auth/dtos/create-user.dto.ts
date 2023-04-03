import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @Length(8, 32)
  password: string

  @IsString()
  @Length(3, 20)
  nickname: string
}