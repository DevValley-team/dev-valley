import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class AuthUser {
  @PrimaryColumn()
  userId: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailToken: string;

  @Column({ nullable: true })
  emailTokenExpiresIn: Date;

  @OneToOne(type => User, (user) => user.authUser)
  @JoinColumn({ name: 'user_id' })
  user: User;
}