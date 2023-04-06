import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { PostLike } from "./entities/post-like.entity";
import { Category } from "./entities/category.entity";
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike, Category]),
    UsersModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
