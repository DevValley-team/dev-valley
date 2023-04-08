import { Expose, Transform } from "class-transformer";

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Transform(({ obj }) => obj.category.name)
  @Expose()
  categoryName: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}