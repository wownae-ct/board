import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ResourceResponseMiddleware } from './resource-response/resource-response.middleware';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // ⬇️정적 리소스 요청을 처리하기 위한 기능을 하는 ResourceResponseMiddleware 미들웨어 클래스를 생성한 뒤 등록한다.
  // 이를 위해 인터페이스 NestModule을 상속한다.
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ResourceResponseMiddleware).forRoutes('/assets');
  }
}
/*
*
기본적으로 NestJS의 요청 처리 순서는 다음과 같습니다:

미들웨어(Middleware)
가드(Guard)
인터셉터(Interceptor)
파이프(Pipe)
컨트롤러(Controller) / 핸들러(Handler)
서비스(Service)

따라서 인터셉터보다 앞선 단계에서 데이터를 처리하려면 미들웨어 또는 가드를 활용하는 것이 일반적입니다.
==================================

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

예제: 커스텀 미들웨어로 데이터 처리
@Injectable()
export class CustomMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 요청 데이터 처리
    console.log('미들웨어에서 요청 처리:', req.body);
    req.body.customData = '미들웨어에서 추가한 데이터';
    next(); // 다음 단계(가드, 인터셉터 등)로 진행
  }
}

미들웨어 등록
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CustomMiddleware } from './custom.middleware';
import { BoardModule } from './board/board.module';
import { DatabaseModule } from './database/database.module';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomMiddleware)
      .forRoutes('*'); // 모든 경로에 적용하거나 특정 경로 지정 가능
  }
}
* */