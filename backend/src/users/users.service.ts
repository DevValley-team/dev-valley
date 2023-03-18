import { Injectable } from '@nestjs/common';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  signin(email: string, password: string) {
    return 'g'
  }

  signup(email: string, password: string) {
    // TODO 암호화 로직 구현
    return 'g'
  }
}
