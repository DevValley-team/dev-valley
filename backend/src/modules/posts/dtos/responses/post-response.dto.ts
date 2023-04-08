import { Expose, Transform, Type } from "class-transformer";
import { UserRole } from "../../../users/entities/user-role.enum";

class UserResponse {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  experience: number;

  @Expose()
  role: UserRole;
}

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

  @Type(() => UserResponse)
  @Expose()
  user: UserResponse;

  @Expose()
  viewCount: number;

  @Expose()
  likeCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}