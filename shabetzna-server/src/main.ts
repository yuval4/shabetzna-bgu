import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './modules/app/app.module';
import { ENV } from './utils/consts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin:
      process.env.ENV === ENV.DEVELOPMENT
        ? 'https://' + process.env.VERCEL_BRANCH_URL.replace('-server', '')
        : process.env.CLIENT_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(cookieParser());

  await app.listen(6060);
}

bootstrap();
