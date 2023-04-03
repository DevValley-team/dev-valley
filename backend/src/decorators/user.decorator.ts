import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenDto } from "../modules/auth/dtos/jwt-token.dto";

export const User = createParamDecorator((data: any, ctx: ExecutionContext): JwtTokenDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});