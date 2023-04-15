import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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
  lastLogInAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}