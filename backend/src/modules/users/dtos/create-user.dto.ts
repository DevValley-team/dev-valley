import { IsBoolean, IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ type: String, example: "example@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 32)
  password: string;

  @ApiProperty()
  @IsString()
  @Length(3, 20)
  nickname: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}