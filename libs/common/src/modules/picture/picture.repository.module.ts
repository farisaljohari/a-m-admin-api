import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureEntity } from './entities';

@Module({
  providers: [],
  exports: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([PictureEntity])],
})
export class PictureRepositoryModule {}
