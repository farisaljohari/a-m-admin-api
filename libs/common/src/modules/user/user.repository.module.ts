import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserNotificationEntity, UserOtpEntity } from './entities';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserNotificationEntity,
      UserOtpEntity,
    ]),
  ],
})
export class UserRepositoryModule {}
