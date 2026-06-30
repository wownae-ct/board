import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⬇️ 전역 ValidationPipe 등록: DTO의 class-validator 규칙(@IsNotEmpty 등)을 실제로 적용한다.
  //    whitelist           : DTO에 없는 속성은 제거
  //    forbidNonWhitelisted: DTO에 없는 속성이 오면 요청을 거부
  //    transform           : 들어온 payload를 DTO 타입으로 변환
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
