import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { SocketIOAdapter } from './socket-io-adapter';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  app.useWebSocketAdapter(new SocketIOAdapter(app, configService, jwtService));

  const port = configService.get('PORT');
  
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
