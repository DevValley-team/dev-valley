import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  @Length(3, 20)
  nickname: string
}