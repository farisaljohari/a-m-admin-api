import { RoleType } from '@app/common/constants/role.type.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class SuperAdminRoleGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    } else {
      const isSuperAdmin = user.roles.some(
        (role) => role.type === RoleType.SUPER_ADMIN,
      );
      if (!isSuperAdmin) {
        throw new BadRequestException(
          'Only super admin role can access this route',
        );
      }
    }
    return user;
  }
}
