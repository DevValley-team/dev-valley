import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Param,
  Redirect,
  ParseUUIDPipe, Query
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/signup-response.dto";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { Public } from "../../common/decorators/public.decorator";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Body() body: LoginUserDto, @Request() req) {
    return await this.authService.login(req.user)
  }

  @Public()
  @Post('signup')
  @Serialize(SignupResponseDto)
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.authService.refresh(body);
  }

  @Public()
  @Get('verify-email')
  @Redirect('http://localhost:3000') // TODO: 이메일 인증 완료 페이지로 리다이렉트
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return await this.authService.verifyEmail(query);
  }

  @Get('send-email-verification')
  async resendEmailVerification(@CurrentUser() currentUser: CurrentUserDto) {
    return await this.authService.sendEmailVerification(currentUser);
  }

  @Get('jwtTest')
  jwtTest(@CurrentUser() currentUser: CurrentUserDto) {
    return currentUser;
  }

  @Get('roleTest')
  @Roles(UserRole.ADMIN)
  roleTest(@CurrentUser() currentUser: CurrentUserDto) {
    return currentUser;
  }

}
