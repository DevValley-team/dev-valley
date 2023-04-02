import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserDto } from "../modules/auth/dtos/jwt-user.dto";

export const User = createParamDecorator((data: any, ctx: ExecutionContext): JwtUserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});