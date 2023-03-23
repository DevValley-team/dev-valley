import { IsEmail, IsString } from "class-validator";

export class CreateUseDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}