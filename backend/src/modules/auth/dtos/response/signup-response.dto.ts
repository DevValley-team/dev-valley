import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SignupResponseDto {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  nickname: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}