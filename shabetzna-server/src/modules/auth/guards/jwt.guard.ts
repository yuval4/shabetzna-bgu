import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { DEV_ENVIRONMENTS } from 'src/utils/consts';

export const IS_DEVELOPMENT = 'isDevelopment';
export const Development = () => SetMetadata(IS_DEVELOPMENT, true);

export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isDevEnv = DEV_ENVIRONMENTS.includes(this.configService.get('ENV'));
    const isDevelopment = this.reflector.getAllAndOverride<boolean>(
      IS_DEVELOPMENT,
      [context.getHandler(), context.getClass()],
    );

    if (isDevelopment && isDevEnv) return true;

    const result = await super.canActivate(context);
    if (!result) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    return result as boolean;
  }
}
