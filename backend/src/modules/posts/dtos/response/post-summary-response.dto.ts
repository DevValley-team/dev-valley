import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/response/user-summary-response.dto";
import { Post } from "../../entities/post.entity";
import { ApiProperty } from "@nestjs/swagger";

export class PostSummaryResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  @Type(() => UserSummaryResponseDto)
  user: UserSummaryResponseDto;

  @ApiProperty()
  @Expose()
  viewCount: number;

  @ApiProperty()
  @Expose()
  likeCount: number;

  @ApiProperty()
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