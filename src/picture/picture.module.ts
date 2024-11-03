import { Module } from '@nestjs/common';
import { PictureService } from './services/picture.service';
import { PictureController } from './controllers/picture.controller';
import { ConfigModule } from '@nestjs/config';
import { PictureRepository } from '@app/common/modules/picture/repositories/picture.repository';

@Module({
  imports: [ConfigModule],
  controllers: [PictureController],
  providers: [PictureService, PictureRepository],
  exports: [PictureService],
})
export class PictureModule {}
