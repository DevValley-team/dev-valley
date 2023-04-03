import { Expose } from "class-transformer";

export class CreateUserResponseDto {
  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  createdAt: Date;
}