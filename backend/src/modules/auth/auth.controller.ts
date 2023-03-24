import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: CreateUserDto) {
    const user = await this.authService.login(body.email, body.password)
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body);
    return user;
  }
}
