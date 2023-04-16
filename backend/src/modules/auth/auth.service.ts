import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthUser } from "../users/entities/auth-user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { EmailVerificationDto } from "../../infrastructure/email/dtos/email-verification.dto";
import { EmailService } from "../../infrastructure/email/email.service";
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from "../users/entities/user-role.enum";
import { VerifyEmailDto } from "./dtos/verify-email.dto";
import { TokenResponseDto } from "./dtos/response/token-response.dto";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(AuthUser) private authUserRepository: Repository<AuthUser>,
              private readonly usersService: UsersService,
              private readonly jwtService: JwtService,
              private readonly emailService: EmailService,
              private readonly configService: ConfigService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.usersService.updateLastLogInAt(user);
    return user;
  }

  async signup(createUserDto: CreateUserDto) {
    const isEmailExists = await this.usersService.isEmailExists(createUserDto.email);

    if (isEmailExists) throw new BadRequestException('이메일을 이미 사용중입니다.');

    const isNicknameExists = await this.usersService.isNicknameExists(createUserDto.nickname);

    if (isNicknameExists) throw new BadRequestException('닉네임을 이미 사용중입니다.');

    const saltRounds = 10;
    createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = await this.usersService.create(createUserDto);

    // TODO: 개발기간에는 이메일 인증을 생략
    // await this.sendEmailVerification(newUser);

    return newUser;
  }

  async login(user: User): Promise<TokenResponseDto> {
    const payload: CurrentUserDto = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return new TokenResponseDto(accessToken, refreshToken);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenResponseDto> {
    const { refreshToken } = refreshTokenDto;

    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('app.jwtRefreshSecret')
      });
    } catch (error) {
      throw new UnauthorizedException('Please login to continue.');
    }

    const authUser = await this.authUserRepository.findOne({ where: { userId: decoded.id } });

    if (authUser.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Please login to continue.');
    }

    const payload: CurrentUserDto = {
      id: decoded.id,
      email: decoded.email,
      nickname: decoded.nickname,
      role: decoded.role
    }

    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(payload);

    return new TokenResponseDto(accessToken, newRefreshToken);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { id, token } = verifyEmailDto;

    const authUser = await this.authUserRepository.findOne({ where: { userId: id } });

    if (!authUser) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    if (authUser.emailTokenExpiresIn < new Date()) {
      throw new BadRequestException('이메일 인증 요청이 만료되었습니다.');
    }

    if (authUser.emailToken !== token) {
      throw new BadRequestException('인증 토큰이 일치하지 않습니다.');
    }

    authUser.emailVerified = true;
    authUser.emailToken = null;
    authUser.emailTokenExpiresIn = null;
    const updateAuthUser = await this.authUserRepository.save(authUser);

    if (updateAuthUser.emailVerified) {
      await this.usersService.updateRole(id, UserRole.USER);
    }

    return updateAuthUser;
  }

  async sendEmailVerification(user: CurrentUserDto | User) {
    const { id, email, nickname } = user;

    let authUser = await this.authUserRepository.findOne({ where: { userId: id } });

    if (authUser.emailVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    const token = await uuidv4();
    authUser.emailToken = token;
    authUser.emailTokenExpiresIn = new Date(Date.now() + 60 * 60 * 1000); // 1h

    const updateAuthUser = await this.authUserRepository.save(authUser);

    const option = new EmailVerificationDto();
    option.verificationLink =
      `${this.configService.get<string>('app.endpoint')}/api/auth/verify-email?token=${token}&id=${id}`;
    option.nickname = nickname;

    await this.emailService.sendEmailVerification(option);

    return updateAuthUser;
  }

  private async generateRefreshToken(payload) {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('app.jwtRefreshExpiresIn')
    });

    const authUser = new AuthUser();
    authUser.userId = payload.id;
    authUser.refreshToken = refreshToken;
    await this.authUserRepository.save(authUser);

    return refreshToken;
  }

}
