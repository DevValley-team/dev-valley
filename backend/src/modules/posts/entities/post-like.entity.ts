import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Post, (post) => post.postLikes)
  post: Post;

  @ManyToOne(type => User, (user) => user.postLikes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}