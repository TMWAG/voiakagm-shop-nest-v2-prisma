import 'reflect-metadata';
import 'es6-shim';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './exceptions/validation.exception';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('VoiakaGM-shop-V2')
    .setDescription('Документация API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        const messages = errors.map((err) => {
          const con = err.constraints;
          if (con) {
            return `${err.property} - ${Object.values(con).join(', ')}`;
          }
        });
        throw new ValidationException(messages);
      },
    }),
  );
  app.enableCors();
  await app.listen(port, () => console.log(`server started at ${port} port`));
}
bootstrap();
