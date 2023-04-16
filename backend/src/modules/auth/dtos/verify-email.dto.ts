import { IsNumber, IsString, IsUUID } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsUUID(4)
  token: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  id: number;
}