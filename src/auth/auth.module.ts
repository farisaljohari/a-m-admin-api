import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserRepositoryModule } from '@app/common/modules/user/user.repository.module';
import { CommonModule } from '../../libs/common/src';
import { UserAuthController } from './controllers';
import { UserAuthService } from './services';
import { UserRepository } from '@app/common/modules/user/repositories';
import { UserSessionRepository } from '@app/common/modules/session/repositories/session.repository';
import { UserOtpRepository } from '@app/common/modules/user/repositories';
import { PictureModule } from 'src/picture/picture.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    ConfigModule,
    UserRepositoryModule,
    CommonModule,
    PictureModule,
    ProjectModule,
  ],
  controllers: [UserAuthController],
  providers: [
    UserAuthService,
    UserRepository,
    UserSessionRepository,
    UserOtpRepository,
  ],
  exports: [UserAuthService],
})
export class AuthenticationModule {}
