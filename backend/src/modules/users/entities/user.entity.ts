import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserRole } from "./user-role.enum";
import { Post } from "../../posts/entities/post.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { PostLike } from "../../posts/entities/post-like.entity";
import { CommentLike } from "../../comments/entities/comment-like.entity";
import { AuthUser } from "./auth-user.entity";

@Entity()
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ default: 0 })
  experience: number;

  @Column({
    type: 'varchar',
    default: UserRole.USER,
  })
  role: string;

  @OneToOne(() => AuthUser, (authUser) => authUser.user)
  authUser: AuthUser;

  @OneToMany(type => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(type => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(type => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(type => CommentLike, (commentLike) => commentLike.user)
  commentLikes: CommentLike[];

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}