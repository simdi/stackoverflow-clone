import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({
    example: 'email@yahoo.com',
    type: String,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
  })
  @MinLength(6)
  @IsString()
  password: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
  firstName: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
  lastName: string;
};