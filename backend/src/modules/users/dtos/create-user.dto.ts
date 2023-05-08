import { IsBoolean, IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ type: String, example: "example@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, minimum: 8, maximum: 32 })
  @IsString()
  @Length(8, 32)
  password: string;

  @ApiProperty({ type: String, minimum: 2, maximum: 20 })
  @IsString()
  @Length(2, 20)
  nickname: string;
}