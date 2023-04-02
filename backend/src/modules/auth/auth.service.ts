import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "./dtos/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dtos/login-user.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService,) {}

  async validateUser(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async signup(dto: CreateUserDto) {
    const users = await this.usersService.findByEmail(dto.email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const saltRounds = 10;
    dto.password = await bcrypt.hash(dto.password, saltRounds);

    return await this.usersService.create(dto);
  }

  async login(user: any) {
    const payload = { userId: user.id,
                      email: user.email,
                      nickname: user.nickname };

    return { accessToken: this.jwtService.sign(payload), };
  }
}
