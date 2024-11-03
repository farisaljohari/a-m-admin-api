import { Global, Module } from '@nestjs/common';
import { SeederService } from './services/seeder.service';
import { ConfigModule } from '@nestjs/config';

import { SuperAdminSeeder } from './services/supper.admin.seeder';
import { UserRepository } from '../modules/user/repositories';
import { UserRepositoryModule } from '../modules/user/user.repository.module';
@Global()
@Module({
  providers: [SeederService, SuperAdminSeeder, UserRepository],
  exports: [SeederService],
  controllers: [],
  imports: [ConfigModule.forRoot(), UserRepositoryModule],
})
export class SeederModule {}
