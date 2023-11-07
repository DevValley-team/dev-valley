import {
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param, ParseIntPipe,
  Query
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Serialize } from "../../common/interceptors/serialize.interceptor";
import { UserResponseDto } from "./dtos/response/user-response.dto";
import { CurrentUserDto } from "../../common/dtos/current-user.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { ExistsEmailDto } from "./dtos/request/exists-email.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('유저')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @Get('me')
  me(@CurrentUser() currentUser: CurrentUserDto) {
    return this.usersService.getUserDetails(currentUser);
  }

  @ApiOperation({ summary: '이메일 중복 확인' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Public()
  @Get('exists')
  async isEmailTaken(@Query() existsEmailDto: ExistsEmailDto) {
    return await this.usersService.isEmailExists(existsEmailDto.email);
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number,
               @CurrentUser() currentUser: CurrentUserDto) {
    return await this.usersService.remove(id, currentUser);
  }

}
