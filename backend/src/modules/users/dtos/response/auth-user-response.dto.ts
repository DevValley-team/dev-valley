import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class AuthUserResponseDto {
  @ApiProperty()
  @Expose()
  emailVerified: boolean;
}