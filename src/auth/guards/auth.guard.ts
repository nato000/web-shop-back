import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/auth.constansts';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.error('No token found in headers:', request.headers); // Debugging
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      console.log('JWT Payload:', payload); // Debugging
      request['user'] = payload; // Set user object including roles
      console.log('User set in request:', request['user']); // Debugging
    } catch (err) {
      console.error('Error verifying token:', err); // Debugging
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    console.log('Authorization header:', authorization); // Debugging
    if (!authorization) {
      return undefined;
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      return undefined;
    }
    return token;
  }
}
