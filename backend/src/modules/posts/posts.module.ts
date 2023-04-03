import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { PostLike } from "./entities/post-like.entity";
import { Category } from "./entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike, Category])],
})
export class PostsModule {}
