import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/responses/user-summary-response.dto";
import { Category } from "../../../categories/entities/category.entity";

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  category: Category;

  @Expose()
  @Type(() => UserSummaryResponseDto)
  user: UserSummaryResponseDto;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}