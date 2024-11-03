import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity, ProjectImagesEntity } from './entities';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ProjectEntity, ProjectImagesEntity])],
})
export class ProjectRepositoryModule {}
