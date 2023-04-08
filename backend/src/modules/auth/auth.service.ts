import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { JwtService } from "@nestjs/jwt";
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

  async signup(createUserDto: CreateUserDto) {
    const isEmail = await this.usersService.isEmailTaken(createUserDto.email);

    if (isEmail) {
      throw new BadRequestException('email in use');
    }

    const saltRounds = 10;
    createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);

    // TODO: email token;

    return await this.usersService.create(createUserDto);
  }

  async login(user: User) {
    const payload = { id: user.id,
                      email: user.email,
                      nickname: user.nickname,
                      role: user.role };

    return { accessToken: this.jwtService.sign(payload), };
  }
}
