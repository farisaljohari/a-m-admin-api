import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupSwaggerAuthentication } from '../libs/common/src/util/user-auth.swagger.utils';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { SeederService } from '@app/common/seed/services/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Set the body parser limit to 1 MB
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 500,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  setupSwaggerAuthentication(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform payloads to their DTO instances.
      transformOptions: {
        enableImplicitConversion: true, // Convert incoming payloads to their DTO instances if possible.
      },
    }),
  );

  const seederService = app.get(SeederService);
  try {
    await seederService.seed();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed!', error);
  }
  console.log('Starting auth at port ...', process.env.PORT || 4000);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
