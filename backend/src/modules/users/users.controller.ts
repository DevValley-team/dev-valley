import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { UserResponseDto } from "./dtos/user-response.dto";
import { JwtTokenUserDto } from "../auth/dtos/jwt-token-user.dto";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { ExistsEmailDto } from "./dtos/exists-email.dto";

@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtTokenUserDto) {
    return this.usersService.findOneById(user.id);
  }

  @Public()
  @Get('exists')
  async isEmailTaken(@Query('email') existsEmailDto: ExistsEmailDto) {
    return await this.usersService.isEmailTaken(existsEmailDto.email);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: JwtTokenUserDto) {
    return await this.usersService.remove(+id, user);
  }

}
