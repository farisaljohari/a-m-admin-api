import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { HelperHashService } from '../../helper/services';
import { UserRepository } from '../../../../common/src/modules/user/repositories';
import { UserSessionRepository } from '../../../../common/src/modules/session/repositories/session.repository';
import { UserSessionEntity } from '../../../../common/src/modules/session/entities';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: UserSessionRepository,
    private readonly helperHashService: HelperHashService,
    private readonly configService: ConfigService,
  ) {
    this.client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user.isUserVerified) {
      throw new BadRequestException('User is not verified');
    }
    if (user) {
      const passwordMatch = this.helperHashService.bcryptCompare(
        pass,
        user.password,
      );
      if (passwordMatch) {
        const { ...result } = user;
        return result;
      }
    }
    return null;
  }

  async createSession(data): Promise<UserSessionEntity> {
    return await this.sessionRepository.save(data);
  }

  async getTokens(payload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '24h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user.userId,
      uuid: user.uuid,
      type: user.type,
      sessionId: user.sessionId,
      roles: user?.roles,
      googleCode: user.googleCode,
    };
    if (payload.googleCode) {
      const profile = await this.getProfile(payload.googleCode);
      user = await this.userRepository.findOne({
        where: { email: profile.email },
      });
      if (!user) {
        return { profile };
      }
    }
    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(user.uuid, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.update(
      { uuid: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getProfile(googleCode: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: googleCode,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      return {
        ...payload,
      };
    } catch (error) {
      throw new UnauthorizedException('Google login failed');
    }
  }
}
