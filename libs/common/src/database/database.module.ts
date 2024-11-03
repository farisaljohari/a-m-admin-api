import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './strategies';
import { UserEntity } from '../modules/user/entities/user.entity';
import { UserSessionEntity } from '../modules/session/entities/session.entity';
import { UserOtpEntity } from '../modules/user/entities';
import { PictureEntity } from '../modules/picture/entities';
import {
  ProjectEntity,
  ProjectImagesEntity,
} from '../modules/project/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          UserEntity,
          UserSessionEntity,
          UserOtpEntity,
          PictureEntity,
          ProjectEntity,
          ProjectImagesEntity,
        ],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: Boolean(JSON.parse(configService.get('DB_SYNC'))),
        logging: false,
        extra: {
          charset: 'utf8mb4',
          max: 20, // set pool max size
          idleTimeoutMillis: 5000, // close idle clients after 5 second
          connectionTimeoutMillis: 11_000, // return an error after 11 second if connection could not be established
          maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
        },
        continuationLocalStorage: true,
        ssl: Boolean(JSON.parse(configService.get('DB_SSL'))),
      }),
    }),
  ],
})
export class DatabaseModule {}
