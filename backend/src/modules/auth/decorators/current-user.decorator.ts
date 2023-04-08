import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from "../dtos/current-user.dto";

export const CurrentUser = createParamDecorator((data: any, ctx: ExecutionContext): CurrentUserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});