import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { UserResponseDto } from "./dtos/user-response.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";

@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('whoami')
  whoami(@Query('id') id: string) {
    return this.usersService.findOneById(parseInt(id));
  }

  @Get()
  async findUserByEmail(@Query('email') email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtTokenUserDto) {
    return await this.usersService.remove(parseInt(id), user);
  }

}
