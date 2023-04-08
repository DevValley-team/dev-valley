import { Type } from "class-transformer";
import { Post } from "../../entities/post.entity";
import { PostSummaryResponseDto } from "./post-summary-response.dto";

export class PostListResponseDto {
  @Type(() => PostSummaryResponseDto)
  posts: PostSummaryResponseDto[];
  page: number;
  limit: number;
  totalPages: number;

  constructor(posts: Post[], page: number, limit: number, totalPosts: number) {
    this.posts = posts.map(post => new PostSummaryResponseDto(post));
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(totalPosts / limit);
  }
}