import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { join } from 'node:path';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const appUrl = configService.get<string>('APP_URL', 'http://127.0.0.1:5173');
  const allowedOrigins = new Set([appUrl]);

  try {
    const mirroredUrl = new URL(appUrl);

    if (mirroredUrl.hostname === 'localhost') {
      mirroredUrl.hostname = '127.0.0.1';
      allowedOrigins.add(mirroredUrl.origin);
    } else if (mirroredUrl.hostname === '127.0.0.1') {
      mirroredUrl.hostname = 'localhost';
      allowedOrigins.add(mirroredUrl.origin);
    }
  } catch (_error) {
    // Ignore malformed APP_URL here and let the configured origin pass through below.
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin non autorisee'), false);
    },
    credentials: true,
  });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.setGlobalPrefix(apiPrefix);
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SellFlow API')
    .setDescription('API SaaS de commerce conversationnel mobile-first')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, swaggerDocument);

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);
}

bootstrap();
