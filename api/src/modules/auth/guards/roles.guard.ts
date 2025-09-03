import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../../generated/prisma';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
  const { user } = context.switchToHttp().getRequest();
  console.log('user this:', user);

  const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (!requiredRoles) {
    return true;
  }

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  return requiredRoles.some((role) => userRoles.includes(role));
}

}