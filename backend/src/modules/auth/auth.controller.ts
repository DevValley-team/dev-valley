import { Body, Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginUserDto, @Request() req) {
    return await this.authService.login(req.user)
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Request() req: any) {
    return req.user;
  }

}
