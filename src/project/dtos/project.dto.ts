import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddProjectDto {
  @ApiProperty({
    description: 'title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    description: 'location',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public location: string;

  @ApiProperty({
    description: 'Array of Base64 images for the project',
    required: true,
    type: [String], // Specify that this is an array of strings
  })
  @IsArray()
  @IsNotEmpty({ each: true }) // Ensure each image in the array is not empty
  public images: string[]; // Array of Base64 strings
}
export class AddProjectImageDto {
  @ApiProperty({
    description: 'Array of Base64 images for the project',
    required: true,
    type: [String], // Specify that this is an array of strings
  })
  @IsArray()
  @IsNotEmpty({ each: true }) // Ensure each image in the array is not empty
  public images: string[]; // Array of Base64 strings
}
