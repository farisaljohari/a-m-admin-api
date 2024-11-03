import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../abstract/entities/abstract.entity';
import { PictureDto } from '../dtos/picture.dto';
import { ImageTypeEnum } from '@app/common/constants/pictures.enum';

@Entity({ name: 'picture' })
export class PictureEntity extends AbstractEntity<PictureDto> {
  @Column({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
    nullable: false,
  })
  public uuid: string;

  @Column({
    nullable: false,
  })
  image: string;

  @Column({
    type: 'enum',
    enum: ImageTypeEnum,
    default: ImageTypeEnum.main_image,
  })
  public type: ImageTypeEnum;

  constructor(partial: Partial<PictureEntity>) {
    super();
    Object.assign(this, partial);
  }
}
