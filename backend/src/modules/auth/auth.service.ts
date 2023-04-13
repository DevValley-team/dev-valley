import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { EmailService } from "../../infrastructure/email/email.service";
import { EmailVerificationService } from "./email-verification.service";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly emailVerificationService: EmailVerificationService,
              private readonly jwtService: JwtService) {}

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

    const result = await this.usersService.create(createUserDto);

    await this.emailVerificationService.createEmailVerification(result);

    return result;
  }

  async login(user: User) {
    const payload: CurrentUserDto = { id: user.id,
                                      email: user.email,
                                      nickname: user.nickname,
                                      role: user.role };

    return { accessToken: this.jwtService.sign(payload), };
  }
}
