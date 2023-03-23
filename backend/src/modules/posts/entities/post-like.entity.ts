import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;
}