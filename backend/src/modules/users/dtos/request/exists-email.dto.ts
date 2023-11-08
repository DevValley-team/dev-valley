import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ExistsEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}