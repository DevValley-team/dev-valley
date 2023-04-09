import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "./entities/comment.entity";
import { CommentLike } from "./entities/comment-like.entity";
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
