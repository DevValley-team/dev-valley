import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entities/comment.entity";
import { CommentLike } from "./entities/comment-like.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike])],
})
export class CommentsModule {}
