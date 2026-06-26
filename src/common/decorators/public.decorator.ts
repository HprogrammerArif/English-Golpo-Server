import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() — Marks a route as public (skips JWT auth guard).
 * Usage: @Public() @Get('/health')
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
