import { IsEmail } from "class-validator";

export class ExistsEmailDto {
  @IsEmail()
  email: string;
}