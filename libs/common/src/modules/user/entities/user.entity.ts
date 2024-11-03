import { Column, DeleteDateColumn, Entity, Unique } from 'typeorm';
import { UserDto, UserNotificationDto, UserOtpDto } from '../dtos';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';

import { defaultProfilePicture } from '@app/common/constants/default.profile.picture';

import { OtpType } from '../../../../src/constants/otp-type.enum';
@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()', // Use gen_random_uuid() for default value
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: true,
    type: 'text',
    default: defaultProfilePicture,
  })
  public profilePicture: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  public password: string;

  @Column()
  public firstName: string;

  @Column({
    nullable: false,
  })
  public lastName: string;

  @Column({
    nullable: true,
  })
  public refreshToken: string;

  @Column({
    nullable: true,
    default: false,
  })
  public isUserVerified: boolean;

  @Column({
    nullable: false,
    default: true,
  })
  public isActive: boolean;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity({ name: 'user-notification' })
@Unique(['user', 'subscriptionUuid'])
export class UserNotificationEntity extends AbstractEntity<UserNotificationDto> {
  @Column({
    nullable: false,
  })
  subscriptionUuid: string;

  @Column({
    nullable: false,
    default: true,
  })
  active: boolean;
  constructor(partial: Partial<UserNotificationEntity>) {
    super();
    Object.assign(this, partial);
  }
}

@Entity({ name: 'user-otp' })
export class UserOtpEntity extends AbstractEntity<UserOtpDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  otpCode: string;

  @Column({ nullable: false })
  expiryTime: Date;

  @Column({
    type: 'enum',
    enum: Object.values(OtpType),
  })
  type: OtpType;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<UserOtpEntity>) {
    super();
    Object.assign(this, partial);
  }
}
