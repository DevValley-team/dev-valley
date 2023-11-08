import { UserSummaryResponseDto } from "../../../users/dtos/response/user-summary-response.dto";
import { Expose, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Comment } from "../../entities/comment.entity";

export class CommentResponseDto {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ type: String })
  @Expose()
  content: string;

  @ApiProperty({ type: UserSummaryResponseDto })
  @Expose()
  @Type(() => UserSummaryResponseDto)
  user: UserSummaryResponseDto;

  @ApiProperty({ type: Number })
  @Expose()
  likeCount: number;

  @ApiProperty({ type: Boolean, default: false })
  @Expose()
  isBlinded: boolean = false;

  @ApiProperty()
  isLiked: boolean = false;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiPropertyOptional({ type: [CommentResponseDto], default: [] })
  @Expose()
  @Type(() => CommentResponseDto)
  children?: CommentResponseDto[];

  constructor(comment?: Comment) {
    if (comment) {
      this.id = comment.id;
      this.content = comment.content;
      this.user = new UserSummaryResponseDto(comment.user);
      this.likeCount = comment.likeCount;
      this.isBlinded = comment.isBlinded;
      this.createdAt = comment.createdAt;
      this.updatedAt = comment.updatedAt;
      this.children = (comment.children ?? []).map(childComment => new CommentResponseDto(childComment));
    }
  }
}