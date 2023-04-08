import { Expose, Type } from "class-transformer";
import { UserSummaryResponseDto } from "../../../users/dtos/responses/user-summary-response.dto";
import { UserResponseDto } from "../../../users/dtos/responses/user-response.dto";
import { Post } from "../../entities/post.entity";
import { CurrentUserDto } from "../../../auth/dtos/current-user.dto";

// TODO: 리팩토링
class CategoryResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class PostDetailsResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => CategoryResponse)
  category: CategoryResponse;

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
  isMyPost: boolean;

  constructor(post: Post, user: CurrentUserDto) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.category = post.category;
    this.user = new UserSummaryResponseDto(post.user);
    this.viewCount = post.viewCount;
    this.likeCount = post.likeCount;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.isMyPost = user.id === post.user.id;
  }
}