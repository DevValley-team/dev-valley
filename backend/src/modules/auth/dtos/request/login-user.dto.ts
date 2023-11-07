import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 32)
  @IsNotEmpty()
  password: string;
}