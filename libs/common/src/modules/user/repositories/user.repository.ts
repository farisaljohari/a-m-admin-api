import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  UserEntity,
  UserNotificationEntity,
  UserOtpEntity,
} from '../entities/';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}

@Injectable()
export class UserNotificationRepository extends Repository<UserNotificationEntity> {
  constructor(private dataSource: DataSource) {
    super(UserNotificationEntity, dataSource.createEntityManager());
  }
}

@Injectable()
export class UserOtpRepository extends Repository<UserOtpEntity> {
  constructor(private dataSource: DataSource) {
    super(UserOtpEntity, dataSource.createEntityManager());
  }
}
