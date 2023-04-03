import { Body, Controller, Get, Post, UseGuards, Request, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SignupResponseDto } from "./dtos/signup-response.dto";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { User } from "../../decorators/user.decorator";
import { JwtTokenDto } from "./dtos/jwt-token.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Body() body: LoginUserDto, @Request() req) {
    return await this.authService.login(req.user)
  }

  @Post('signup')
  @Serialize(SignupResponseDto)
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  test(@User() user: JwtTokenDto) {
    return user;
  }

}
