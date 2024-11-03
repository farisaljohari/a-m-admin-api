import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  public location: string;
}
export class ProjectImagesDto {
  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
