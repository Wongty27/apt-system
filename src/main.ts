import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors({
    origin: ['http://localhost:3001'],
    allowedHeaders: ['Authorization, Content-Type', 'Accept'],
    methods: ['GET, POST, PUT, DELETE'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, disableErrorMessages: false }),
  );
  await app.register(fastifyCookie, { secret: process.env.COOKIE_SECRET });
  await app.register(fastifyCsrf, {
    cookieOpts: {
      signed: false,
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Appointment API')
    .setDescription('Multi-tenancy Appointment API.')
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Enter JWT token',
    //     in: 'header',
    //   },
    //   'access-token',
    // )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('Server started'))
  .catch((error) => console.error(error));
