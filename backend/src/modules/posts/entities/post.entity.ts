import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Category } from "../../categories/entities/category.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { PostLike } from "./post-like.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  categoryName: string;

  @ManyToOne(type => Category, (category) => category.posts)
  @JoinColumn()
  category: Category;

  @ManyToOne(type => User, (user) => user.posts)
  user: User;

  @OneToMany(type => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comments: Comment[];

  @Column({ default: 0 })
  viewCount: number;

  @OneToMany(type => PostLike, (postLike) => postLike.post, { onDelete: 'CASCADE' })
  postLikes: PostLike[];

  @Column({ default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}