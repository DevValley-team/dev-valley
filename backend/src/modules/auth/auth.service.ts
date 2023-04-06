import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dtos/login-user.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService,) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    await this.usersService.updateLastLogInAt(user);
    return user;
  }

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (user) {
      throw new BadRequestException('email in use');
    }

    const saltRounds = 10;
    dto.password = await bcrypt.hash(dto.password, saltRounds);

    return await this.usersService.create(dto);
  }

  async login(user: User) {
    const payload = { id: user.id,
                      email: user.email,
                      nickname: user.nickname,
                      role: user.role };

    return { accessToken: this.jwtService.sign(payload), };
  }
}
