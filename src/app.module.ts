import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AuthenticationModule } from './auth/auth.module';
import { SeederModule } from '@app/common/seed/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
    }),
    AuthenticationModule,
    SeederModule,
  ],
})
export class AppModule {}
