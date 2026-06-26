import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() — Extracts the authenticated user from the JWT payload.
 * Usage: async someRoute(@CurrentUser() user: JwtUser) {}
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
