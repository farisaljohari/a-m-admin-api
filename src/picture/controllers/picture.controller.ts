import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  // UseGuards,
} from '@nestjs/common';
import { PictureService } from '../services/picture.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt.auth.guard';
import { EnableDisableStatusEnum } from '@app/common/constants/days.enum';
import { AddPictureDto } from '../dtos';

@ApiTags('Picture Module')
@Controller({
  version: EnableDisableStatusEnum.ENABLED,
  path: 'picture',
})
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPictures() {
    return await this.pictureService.getAllPictures();
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('')
  async addPicture(@Body() addPictureDto: AddPictureDto) {
    const picture = await this.pictureService.addPicture(addPictureDto);

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Picture added successfully',
      data: picture,
    };
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('main')
  async getMainPicture() {
    return await this.pictureService.getMainPicture();
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('about')
  async getAboutPicture() {
    return await this.pictureService.getAboutPicture();
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Put(':pictureUuid')
  async updatePicture(
    @Param('pictureUuid') pictureUuid: string,
    @Body() addPictureDto: AddPictureDto,
  ) {
    const picture = await this.pictureService.updatePicture(
      pictureUuid,
      addPictureDto,
    );

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Picture updated successfully',
      data: picture,
    };
  }
}
