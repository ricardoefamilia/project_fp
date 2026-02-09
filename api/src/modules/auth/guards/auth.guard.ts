import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'better-auth';
import { auth } from '../auth';
import { IS_OPTIONAL_KEY } from '../decorators/optional.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface Session {
  activeOrganizationId?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(IS_OPTIONAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<{headers: HeadersInit | undefined; session?: Session; user?: User & { role: string }}>();
    console.log('AuthGuard - Incoming request:', {
      headers: request.headers,
      session: request.session,
      user: request.user,
    });

    const activeMemberRole = await auth.api.getActiveMemberRole({
      headers: request.headers || {},
      query: {
        userId: request.user?.id,
        organizationId: request.session?.activeOrganizationId,
      },
    })
    console.log('AuthGuard - Active member role:', activeMemberRole);
    const session = request.session || request.user;
    
    if (!session && !isOptional) {
      throw new UnauthorizedException('Authentication required');
    }

    console.log('AuthGuard - User request.user:', activeMemberRole.role);
    console.log('AuthGuard - Required roles:', requiredRoles);
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles: string[] = activeMemberRole.role ? [activeMemberRole.role] : [];
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
 