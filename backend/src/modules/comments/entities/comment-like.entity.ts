import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;
}