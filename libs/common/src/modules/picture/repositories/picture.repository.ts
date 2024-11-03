import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PictureEntity } from '../entities';

@Injectable()
export class PictureRepository extends Repository<PictureEntity> {
  constructor(private dataSource: DataSource) {
    super(PictureEntity, dataSource.createEntityManager());
  }
}
