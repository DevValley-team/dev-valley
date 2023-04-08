import { Expose } from "class-transformer";
import { User } from "../../entities/user.entity";

export class UserSummaryResponseDto {
  @Expose()
  nickname: string;

  @Expose()
  experience: number;

  constructor(user?: User) {
    if (user) {
      this.nickname = user.nickname;
      this.experience = user.experience;
    }
  }
}