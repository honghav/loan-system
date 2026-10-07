import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.FRONT_API ? [process.env.FRONT_API, process.env.FRONT_API.replace(/\/$/, '')] : []),
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger documentation for Personal Project Manager API v2
  const config = new DocumentBuilder()
    .setTitle('Personal Project Manager API')
    .setDescription(
      'Backend REST API for managing personal software projects, features, tasks, activity logs, and dashboard statistics.',
    )
    .setVersion('2.0')
    .addTag('Projects', 'Project management endpoints')
    .addTag('Features', 'Feature breakdown endpoints')
    .addTag('Tasks', 'Task management & status tracking endpoints')
    .addTag('Activities', 'Project activity audit history')
    .addTag('Dashboard', 'Overview statistics & overdue tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // Also keep /api path alias for backward compatibility
  SwaggerModule.setup('api', app, document);

  app.use(
    '/storage',
    express.static(join(process.cwd(), 'storage')),
  );
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({
    limit: '20mb',
    extended: true,
  }));
  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger documentation (v2): http://localhost:${port}/api/docs`);
}
bootstrap();