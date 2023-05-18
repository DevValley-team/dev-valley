import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AuthUser } from "../../entities/auth-user.entity";
import { AuthUserResponseDto } from "./auth-user-response.dto";

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  experience: number;

  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  @Type(() => AuthUserResponseDto)
  authUser: AuthUserResponseDto;

  @ApiProperty()
  @Expose()
  lastLoginAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}