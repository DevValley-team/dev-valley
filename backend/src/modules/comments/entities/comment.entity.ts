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

  @ManyToOne(type => Comment, (comment) => comment.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(type => Comment, (comment) => comment.parent)
  children: Comment[];

  @Column()
  content: string;

  @ManyToOne(type => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(type => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  postId: number;

  @OneToMany(type => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isBlinded: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;
}
