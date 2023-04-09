import { UserSummaryResponseDto } from "../../users/dtos/responses/user-summary-response.dto";
import { Expose, Type } from "class-transformer";

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  parentId?: number;

  @Expose()
  @Type(() => UserSummaryResponseDto)
  user: UserSummaryResponseDto;

  @Expose()
  isBlinded: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CommentResponseDto)
  children: CommentResponseDto[];
}