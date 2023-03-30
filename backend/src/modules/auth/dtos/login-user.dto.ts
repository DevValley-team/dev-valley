import { Expose } from "class-transformer";

export class LoginUserDto {
  @Expose()
  email: string;

  @Expose()
  password: string;
}