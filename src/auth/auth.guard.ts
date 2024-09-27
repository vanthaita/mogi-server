import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractTokenFromCookie(request: Request): string | undefined {
    console.log('Extracting token from cookie', request);
    console.log('Extracting token from cookie', request['access_token']);
    return request.cookies['access_token'];
  }
}
