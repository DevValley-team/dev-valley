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
  ParseUUIDPipe
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/signup-response.dto";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { Public } from "../../common/decorators/public.decorator";
import { EmailVerificationService } from "./email-verification.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly emailVerificationService: EmailVerificationService) {}

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

  @Get(':email/emailAuth/:code')
  async emailAuth(@Param('email') email: string, @Param('code') code: string) {
    return 'success';
  }

  @Get('email-verify/:token')
  @Redirect('/')
  async verifyEmail(@Param('token', ParseUUIDPipe) token: string) {
    await this.emailVerificationService.verifyEmail(token);
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
