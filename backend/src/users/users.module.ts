import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
