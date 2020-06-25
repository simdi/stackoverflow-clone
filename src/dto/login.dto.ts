import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'email@yahoo.com',
    type: String,
  })
  @IsString()
  email: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
  password: string;
};