import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AuthenticationModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
    }),
    AuthenticationModule,
  ],
})
export class AppModule {}
