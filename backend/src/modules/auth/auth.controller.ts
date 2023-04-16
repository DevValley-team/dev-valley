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
  ParseUUIDPipe, Query, HttpStatus
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/response/signup-response.dto";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { Public } from "../../common/decorators/public.decorator";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TokenResponseDto } from "./dtos/response/token-response.dto";

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '일반 로그인 요청' })
  @ApiResponse({ status: HttpStatus.OK, type: TokenResponseDto })
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginUserDto, @Request() req) {
    return await this.authService.login(req.user)
  }

  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SignupResponseDto })
  @Public()
  @Post('signup')
  @Serialize(SignupResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @ApiOperation({ summary: '리프레쉬 토큰 요청' })
  @ApiResponse({ status: HttpStatus.OK, type: TokenResponseDto })
  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return await this.authService.refresh(body);
  }

  @ApiOperation({ summary: '메일 인증' })
  @Public()
  @Get('verify-email')
  @Redirect('http://localhost:3000') // TODO: 이메일 인증 완료 페이지로 리다이렉트
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return await this.authService.verifyEmail(query);
  }

  @ApiOperation({ summary: '메일 인증 요청 (회원가입 시 기본적으로 메일 발송함)' })
  @ApiResponse({ status: HttpStatus.ACCEPTED })
  @Get('send-email-verification')
  @HttpCode(HttpStatus.ACCEPTED)
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
