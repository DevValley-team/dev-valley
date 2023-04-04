import { Expose } from "class-transformer";
import { UserResponseDto } from "../../users/dtos/user-response.dto";

export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  category: CategoryResponseDto;

  @Expose()
  author: UserResponseDto;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}