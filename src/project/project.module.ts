import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import {
  ProjectImageRepository,
  ProjectRepository,
} from '@app/common/modules/project/repositories/project.repository';

@Module({
  imports: [ConfigModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, ProjectImageRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
