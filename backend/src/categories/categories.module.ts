import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UploadModule } from 'src/upload/upload.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [UploadModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
