import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { JwtTokenDto } from "../auth/dtos/jwt-token.dto";
import { CurrentUser } from "../../decorators/current-user.decorator";

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('whoami')
  whoami(@Query('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get()
  async findUserByEmail(@Query('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtTokenDto) {
    return await this.usersService.remove(parseInt(id), user);
  }

}
