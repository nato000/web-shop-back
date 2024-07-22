import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/auth.constansts';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('requiredRoles: ', requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.error('No token found'); // Debugging
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
    // const user = request.user;
    const user = request['user'];

    console.log('User in RolesGuard:', user); // Add logging to debug

    if (!user || !user.roles) {
      console.error('User or roles not defined');
      return false;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
