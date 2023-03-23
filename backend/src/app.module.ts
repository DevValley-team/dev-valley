import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./modules/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./modules/users/entities/user.entity";
import { PostsModule } from "./modules/posts/posts.module";
import { CommentsModule } from "./modules/comment/commentsModule";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Post } from "./modules/posts/entities/post.entity";
import { PostLike } from "./modules/posts/entities/post-like.entity";
import { Comment } from "./modules/comment/entities/comment.entity";
import { CommentLike } from "./modules/comment/entities/comment-like.entity";
import { Category } from "./modules/posts/entities/category.entity";

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot({
    type: "sqlite",
    database: "db.sqlite",
    entities: [User, Post, PostLike, Comment, CommentLike, Category],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy()
  }),
    UsersModule,
    PostsModule,
    CommentsModule
  ],
  providers: [AppService]
})
export class AppModule {
}
