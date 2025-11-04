import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC } from 'src/helper/public';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      if (!token || type !== 'Bearer') {
        throw new BadRequestException('Not authenticated');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      request['payload'] = payload;
    } catch (error) {
      throw new BadRequestException('No access ' + error.message);
    }

    return true;
  }
}
