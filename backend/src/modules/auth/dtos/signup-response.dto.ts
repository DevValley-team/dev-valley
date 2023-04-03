import { Expose } from "class-transformer";

export class SignupResponseDto {
  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  createdAt: Date;
}