import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProjectEntity, ProjectImagesEntity } from '../entities';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }
}
@Injectable()
export class ProjectImageRepository extends Repository<ProjectImagesEntity> {
  constructor(private dataSource: DataSource) {
    super(ProjectImagesEntity, dataSource.createEntityManager());
  }
}
