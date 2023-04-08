import { Body, Controller, Get, Post, UseGuards, Request, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/signup-response.dto";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { CurrentUserDto } from "./dtos/current-user.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Roles } from "./decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { Public } from "./decorators/public.decorator";

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
