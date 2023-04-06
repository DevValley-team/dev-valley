import { Expose } from "class-transformer";

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  experience: number;

  @Expose()
  role: string;

  @Expose()
  emailVerified: boolean;

  @Expose()
  lastLogInAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}