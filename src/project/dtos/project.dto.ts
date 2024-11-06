import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

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

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
