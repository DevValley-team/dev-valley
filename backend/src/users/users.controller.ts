import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signin')
  signin(@Body('email') email: string,
         @Body('password') password: string) {
    return this.usersService.signin(email,
                                    password);
  }

  @Post('signup')
  signup(@Body('email') email: string,
         @Body('password') password: string) {
    return this.usersService.signup(email,
                                    password);
  }

}
