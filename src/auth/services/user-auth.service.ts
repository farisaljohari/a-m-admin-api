import { UserRepository } from '../../../libs/common/src/modules/user/repositories';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserSignUpDto } from '../dtos/user-auth.dto';
import { HelperHashService } from '../../../libs/common/src/helper/services';
import { UserLoginDto } from '../dtos/user-login.dto';
import { AuthService } from '../../../libs/common/src/auth/services/auth.service';
import { UserOtpRepository } from '../../../libs/common/src/modules/user/repositories/user.repository';
import { ForgetPasswordDto, UserOtpDto, VerifyOtpDto } from '../dtos';
import { EmailService } from '../../../libs/common/src/util/email.service';
import { OtpType } from '../../../libs/common/src/constants/otp-type.enum';
import { UserEntity } from '../../../libs/common/src/modules/user/entities/user.entity';
import * as argon2 from 'argon2';
import { differenceInSeconds } from '@app/common/helper/differenceInSeconds';
import { LessThan, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserSessionRepository } from '@app/common/modules/session/repositories/session.repository';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: UserSessionRepository,
    private readonly otpRepository: UserOtpRepository,
    private readonly helperHashService: HelperHashService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const findUser = await this.findUser(userSignUpDto.email);
    if (findUser) {
      throw new BadRequestException('User already registered with given email');
    }
    const salt = this.helperHashService.randomSalt(10); // Hash the password using bcrypt
    const hashedPassword = await this.helperHashService.bcrypt(
      userSignUpDto.password,
      salt,
    );

    try {
      const { regionUuid, ...rest } = userSignUpDto;
      const user = await this.userRepository.save({
        ...rest,
        password: hashedPassword,
        region: regionUuid
          ? {
              uuid: regionUuid,
            }
          : {
              regionName: 'United Arab Emirates',
            },
      });

      return user;
    } catch (error) {
      throw new BadRequestException('Failed to register user');
    }
  }

  async findUser(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const findUser = await this.findUser(forgetPasswordDto.email);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    const salt = this.helperHashService.randomSalt(10);
    const password = this.helperHashService.bcrypt(
      forgetPasswordDto.password,
      salt,
    );
    return await this.userRepository.update(
      { uuid: findUser.uuid },
      { password },
    );
  }

  async userLogin(data: UserLoginDto) {
    try {
      let user;
      if (data.googleCode) {
        const googleUserData = await this.authService.login({
          googleCode: data.googleCode,
        });
        const userExists = await this.userRepository.exists({
          where: {
            email: googleUserData['email'],
          },
        });

        user = await this.userRepository.findOne({
          where: {
            email: googleUserData['email'],
          },
        });
        if (!userExists) {
          await this.signUp({
            email: googleUserData['email'],
            firstName: googleUserData['given_name'],
            lastName: googleUserData['family_name'],
            password: googleUserData['email'],
          });
        }
        data.email = googleUserData['email'];
        data.password = googleUserData['password'];
      }
      if (!data.googleCode) {
        user = await this.authService.validateUser(data.email, data.password);
      }
      const session = await Promise.all([
        await this.sessionRepository.update(
          { userId: user.id },
          {
            isLoggedOut: true,
          },
        ),
        await this.authService.createSession({
          userId: user.uuid,
          loginTime: new Date(),
          isLoggedOut: false,
        }),
      ]);
      const res = await this.authService.login({
        email: user.email,
        userId: user.uuid,
        uuid: user.uuid,
        roles: user?.roles?.map((role) => {
          return { uuid: role.uuid, type: role.roleType.type };
        }),
        sessionId: session[1].uuid,
      });
      return res;
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async findOneById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { uuid: id } });
  }

  async generateOTP(data: UserOtpDto): Promise<{
    otpCode: string;
    cooldown: number;
  }> {
    const otpLimiter = new Date();
    otpLimiter.setDate(
      otpLimiter.getDate() - this.configService.get<number>('OTP_LIMITER'),
    );
    const userExists = await this.userRepository.exists({
      where: {
        email: data.email,
        isUserVerified: data.type === OtpType.PASSWORD ? true : undefined,
      },
    });
    if (!userExists) {
      throw new BadRequestException('User not found');
    }
    await this.otpRepository.softDelete({ email: data.email, type: data.type });
    await this.otpRepository.delete({
      email: data.email,
      type: data.type,
      createdAt: LessThan(otpLimiter),
    });
    const countOfOtp = await this.otpRepository.count({
      withDeleted: true,
      where: {
        email: data.email,
        type: data.type,
        createdAt: MoreThan(otpLimiter),
      },
    });
    const lastOtp = await this.otpRepository.findOne({
      where: { email: data.email, type: data.type },
      order: { createdAt: 'DESC' },
      withDeleted: true,
    });
    let cooldown = 30 * Math.pow(2, countOfOtp - 1);
    if (lastOtp) {
      const now = new Date();
      const timeSinceLastOtp = differenceInSeconds(now, lastOtp.createdAt);

      if (timeSinceLastOtp < cooldown) {
        throw new BadRequestException({
          message: `Please wait ${cooldown - timeSinceLastOtp} more seconds before requesting a new OTP.`,
          data: {
            cooldown: cooldown - timeSinceLastOtp,
          },
        });
      }
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    await this.otpRepository.save({
      email: data.email,
      otpCode,
      expiryTime,
      type: data.type,
    });
    const countOfOtpToReturn = await this.otpRepository.count({
      withDeleted: true,
      where: {
        email: data.email,
        type: data.type,
        createdAt: MoreThan(otpLimiter),
      },
    });
    cooldown = 30 * Math.pow(2, countOfOtpToReturn - 1);
    const subject = 'OTP send successfully';
    const message = `Your OTP code is ${otpCode}`;
    this.emailService.sendEmail(data.email, subject, message);
    return { otpCode, cooldown };
  }

  async verifyOTP(
    data: VerifyOtpDto,
    fromNewPassword: boolean = false,
  ): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: { email: data.email, type: data.type, otpCode: data.otpCode },
    });

    if (!otp) {
      const user = await this.userRepository.findOne({
        where: {
          email: data.email,
        },
      });
      if (!user) {
        throw new BadRequestException('this email is not registered');
      }
      throw new BadRequestException('You entered wrong otp');
    }

    if (otp.otpCode !== data.otpCode) {
      throw new BadRequestException('You entered wrong otp');
    }

    if (otp.expiryTime < new Date()) {
      await this.otpRepository.delete(otp.uuid);
      throw new BadRequestException('OTP expired');
    }
    if (fromNewPassword) {
      await this.otpRepository.delete(otp.uuid);
    }
    if (data.type == OtpType.VERIFICATION) {
      await this.userRepository.update(
        { email: data.email },
        { isUserVerified: true },
      );
    }

    return true;
  }

  async userList(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
      },
    });
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
    type: string,
    sessionId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { uuid: userId } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.authService.getTokens({
      email: user.email,
      userId: user.uuid,
      uuid: user.uuid,
      type,
      sessionId,
    });
    await this.authService.updateRefreshToken(user.uuid, tokens.refreshToken);
    return tokens;
  }
}
