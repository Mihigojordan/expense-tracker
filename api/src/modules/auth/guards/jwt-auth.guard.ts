// jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RequestWithUser } from '../../../common/interfaces/user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractToken(request);
    console.log(token);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY || 'secretkey',
      });

      // Attach decoded payload to request (so controllers can access request.user)
      request.user = payload;

      return true;
    } catch (error) {
      console.error('JWT validation error:', error);
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private extractToken(req: Request): string | undefined {
    // Priority 1: Cookie
    if (req.cookies?.['accessToken']) {
      return req.cookies['accessToken'];
    }

    // Priority 2: Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    return undefined;
  }
}
