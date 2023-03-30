import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { CreateUserDto } from "../auth/dtos/create-user.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  whoami(@Query('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

}
