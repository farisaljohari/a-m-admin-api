import { ImageTypeEnum } from '@app/common/constants/pictures.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class PictureDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  public type: ImageTypeEnum;
}
