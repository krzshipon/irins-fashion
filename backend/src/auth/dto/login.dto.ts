import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '01700000000', description: 'User mobile number' })
  @IsString()
  mobile: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;
}
