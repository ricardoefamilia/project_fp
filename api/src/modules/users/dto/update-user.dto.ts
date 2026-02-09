import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User name',
    minLength: 2,
    maxLength: 100,
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'User profile image URL',
    maxLength: 500,
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  image?: string;
}
