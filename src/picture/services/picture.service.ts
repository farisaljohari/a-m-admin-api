import { PictureRepository } from '@app/common/modules/picture/repositories/picture.repository';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddPictureDto } from '../dtos';
import { ImageTypeEnum } from '@app/common/constants/pictures.enum';

@Injectable()
export class PictureService {
  constructor(private readonly pictureRepository: PictureRepository) {}
  async getAllPictures() {
    try {
      const pictures = await this.pictureRepository.find();

      return pictures;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('pictures not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async addPicture(addPictureDto: AddPictureDto) {
    try {
      const pictures = await this.pictureRepository.save({
        image: addPictureDto.image,
        type: addPictureDto.type,
      });

      return pictures;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error While Adding Picture',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getMainPicture() {
    try {
      const picture = await this.pictureRepository.findOne({
        where: {
          type: ImageTypeEnum.main_image,
        },
      });

      return picture;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('picture not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async getAboutPicture() {
    try {
      const picture = await this.pictureRepository.findOne({
        where: {
          type: ImageTypeEnum.about_image,
        },
      });

      return picture;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err; // Re-throw BadRequestException
      } else {
        throw new HttpException('picture not found', HttpStatus.NOT_FOUND);
      }
    }
  }
  async updatePicture(pictureUuid: string, addPictureDto: AddPictureDto) {
    try {
      const pictures = await this.pictureRepository.update(
        { uuid: pictureUuid },
        {
          image: addPictureDto.image,
          type: addPictureDto.type,
        },
      );

      return pictures;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error While Updating Picture',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
