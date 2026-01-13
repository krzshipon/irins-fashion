import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config'; // Keep ConfigService as it's used in the original for CORS and PORT
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cookie Parser
  app.use(cookieParser());

  // Get ConfigService for dynamic configurations
  const configService = app.get(ConfigService);

  // Enable CORS for Storefront and Admin
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'), // Original FRONTEND_URL
      configService.get('ADMIN_URL'), // Original ADMIN_URL
      'http://localhost:3000', // Added from the provided snippet
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Irins Fashion API')
    .setDescription('The Irins Fashion API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get('PORT') ?? 3001);
}
bootstrap();
