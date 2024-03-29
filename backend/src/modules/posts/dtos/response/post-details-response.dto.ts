import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/response/user-summary-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PostDetailsResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  categoryName: string;

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

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  isAuthor: boolean = false;

  @ApiProperty()
  isLiked: boolean = false;
}