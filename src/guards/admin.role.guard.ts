import { RoleType } from '@app/common/constants/role.type.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AdminRoleGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    } else {
      const isAdmin = user.roles.some(
        (role) =>
          role.type === RoleType.SUPER_ADMIN || role.type === RoleType.ADMIN,
      );
      if (!isAdmin) {
        throw new BadRequestException('Only admin role can access this route');
      }
    }
    return user;
  }
}
