import { IsDataURI, IsNumber, IsString } from "class-validator";

export class EmailVerificationDto {
  @IsDataURI()
  verificationLink: string;

  @IsString()
  nickname: string;
}