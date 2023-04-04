import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenUserDto } from "../modules/auth/dtos/jwt-token-user.dto";

export const CurrentUser = createParamDecorator((data: any, ctx: ExecutionContext): JwtTokenUserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});