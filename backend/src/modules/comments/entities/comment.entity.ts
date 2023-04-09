import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { User } from "../../users/entities/user.entity";
import { CommentLike } from "./comment-like.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true, onDelete: 'CASCADE' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @Column()
  content: string;

  @ManyToOne(type => User, (user) => user.comments)
  user: User;

  @ManyToOne(type => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isBlinded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
