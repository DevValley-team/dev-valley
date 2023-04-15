import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Comment, (comment) => comment.commentLikes)
  comment: Comment;

  @ManyToOne(type => User, (user) => user.commentLikes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}