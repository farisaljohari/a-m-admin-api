import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsPasswordStrong } from 'src/validators/password.validator';

export class UserSignUpDto {
  @ApiProperty({
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: 'password',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsPasswordStrong({
    message:
      'password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
  })
  public password: string;

  @ApiProperty({
    description: 'first name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({
    description: 'last name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsOptional()
  public regionUuid?: string;
}
