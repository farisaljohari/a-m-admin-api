import { ImageTypeEnum } from '@app/common/constants/pictures.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class AddPictureDto {
  @ApiProperty({
    description: 'image',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public image: string;

  @ApiProperty({
    description: 'type',
    enum: ImageTypeEnum,
    required: true,
  })
  @IsNotEmpty()
  public type: ImageTypeEnum;
}
