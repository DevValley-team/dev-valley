import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { PostLike } from "./entities/post-like.entity";
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from "../users/users.module";
import { CategoriesModule } from "../categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike]),
    UsersModule,
    CategoriesModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {}
