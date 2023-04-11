import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class EmailVerification {
  @PrimaryColumn()
  userId: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  tokenExpiresAt: Date;

  @OneToOne(type => User, (user) => user.emailVerification)
  @JoinColumn({ name: 'user_id' })
  user: User;
}