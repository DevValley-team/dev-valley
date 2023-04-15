import { IsNumber, IsString, IsUUID } from "class-validator";
import { Transform } from "class-transformer";

export class VerifyEmailDto {
  @IsString()
  @IsUUID(4)
  token: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  id: number;
}