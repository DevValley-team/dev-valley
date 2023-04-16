import { Expose } from "class-transformer";
import { User } from "../../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserSummaryResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  nickname: string;

  @ApiProperty({ type: Number })
  @Expose()
  experience: number;

  constructor(user?: User) {
    if (user) {
      this.nickname = user.nickname;
      this.experience = user.experience;
    }
  }
}