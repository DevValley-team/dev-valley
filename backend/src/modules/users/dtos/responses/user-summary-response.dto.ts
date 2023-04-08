import { Expose } from "class-transformer";
import { User } from "../../entities/user.entity";

export class UserSummaryResponseDto {
  @Expose()
  id: number;

  @Expose()
  nickname: string;

  @Expose()
  experience: number;

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.experience = user.experience;
  }
}