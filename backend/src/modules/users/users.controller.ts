import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param, ParseIntPipe,
  Query
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { UserResponseDto } from "./dtos/responses/user-response.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ExistsEmailDto } from "./dtos/exists-email.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Serialize(UserResponseDto)
  me(@CurrentUser() currentUser: CurrentUserDto) {
    return this.usersService.findOneById(currentUser.id);
  }

  @Public()
  @Get('exists')
  async isEmailTaken(@Query() existsEmailDto: ExistsEmailDto) {
    return await this.usersService.isEmailTaken(existsEmailDto.email);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.usersService.remove(id, currentUser);
  }

}
