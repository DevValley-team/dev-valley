import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  whoami(@Query('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

}
