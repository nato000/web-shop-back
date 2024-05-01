import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const swaggerOptions = new DocumentBuilder()
    .setTitle('University API')
    .setDescription('This page provides University API documentation')
    .build();

  // .addBearerAuth(
  //   {
  //     type: 'http',
  //     scheme: 'bearer',
  //     bearerFormat: 'JWT',
  //     name: 'Authorization',
  //     description: 'Authorization',
  //   },
  //   'jwt',
  // );

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(`/docs`, app, swaggerDocument);

  await app.listen(Number(process.env.SERVER_PORT));
  console.log(`server start port:${process.env.SERVER_PORT}`);
}
bootstrap();
