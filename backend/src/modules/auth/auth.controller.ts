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
  ParseUUIDPipe, Query, HttpStatus, Res
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/request/create-user.dto";
import { LoginUserDto } from "./dtos/request/login-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/response/signup-response.dto";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { Public } from "../../common/decorators/public.decorator";
import { RefreshTokenDto } from "./dtos/request/refresh-token.dto";
import { VerifyEmailDto } from "./dtos/request/verify-email.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TokenResponseDto } from "./dtos/response/token-response.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly configService: ConfigService) {}

  @ApiOperation({ summary: '일반 로그인 요청' })
  @ApiResponse({ status: HttpStatus.OK, type: TokenResponseDto })
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
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

  @Public()
  @Get('verify-email')
  @Redirect()
  async verifyEmail(@Query() query: VerifyEmailDto,
                    @Res() res: Response) {
    await this.authService.verifyEmail(query);
    return {
      url: this.configService.get<string>('app.frontendUrl')
    };
  }

  @ApiOperation({ summary: '메일 인증 요청 (회원가입 시 기본적으로 메일 발송함)' })
  @ApiResponse({ status: HttpStatus.ACCEPTED })
  @Get('send-email-verification')
  @HttpCode(HttpStatus.ACCEPTED)
  async resendEmailVerification(@CurrentUser() currentUser: CurrentUserDto): Promise<void> {
    await this.authService.sendEmailVerification(currentUser);
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
