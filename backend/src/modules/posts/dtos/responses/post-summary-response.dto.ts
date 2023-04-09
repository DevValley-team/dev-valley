import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/responses/user-summary-response.dto";
import { Post } from "../../entities/post.entity";

export class PostSummaryResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  @Type(() => UserSummaryResponseDto)
  user: UserSummaryResponseDto;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  createdAt: Date;

  constructor(post?: Post) {
    this.id = post.id;
    this.title = post.title;
    this.user = new UserSummaryResponseDto(post.user);
    this.viewCount = post.viewCount;
    this.likeCount = post.likeCount;
    this.createdAt = post.createdAt;
  }
}