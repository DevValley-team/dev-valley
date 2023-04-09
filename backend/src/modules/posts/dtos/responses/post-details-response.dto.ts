import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/responses/user-summary-response.dto";
import { CategoryResponseDto } from "../../../categories/dtos/category-response.dto";

export class PostDetailsResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

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

  @Expose()
  isAuthor: boolean;
}