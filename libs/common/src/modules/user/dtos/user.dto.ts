import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;
}

export class UserNotificationDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public userUuid: string;

  @IsString()
  @IsNotEmpty()
  public subscriptionUuid: string;

  @IsBoolean()
  @IsNotEmpty()
  public active: boolean;
}

export class UserOtpDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public otpCode: string;

  @IsString()
  @IsNotEmpty()
  public expiryTime: string;
}

export class UserRoleDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public userUuid: string;

  @IsString()
  @IsNotEmpty()
  public roleTypeUuid: string;
}

export class UserSpaceDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public spaceUuid: string;

  @IsString()
  @IsNotEmpty()
  public userUuid: string;
}
