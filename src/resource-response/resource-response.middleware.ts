import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import * as FileUtil from "../utils/file-util.utils"

@Injectable()
export class ResourceResponseMiddleware implements NestMiddleware {
  // ⬇️ NestJS의 로그를 남기는 기능을 사용하기 위해 Logger 객체를 ResourceResponseInterceptor 클래스의 인스턴스화와 동시에 생성한다.
  private readonly logger: Logger = new Logger(ResourceResponseMiddleware.name);

  use(req: Request, res: Response, next: () => void) {
    // ⬇️(1) Client의 HTTP 요청 메소드가 무엇인지 알아낸다.
    const method: string = req.method.toUpperCase();

    // ⬇️(2) Client의 HTTP 요청 메소드가 GET이 아닌 경우 현재 미들웨어의 처리대상이 아니므로 바로 next()를 호출한다.
    if (method != 'GET') {
      return next();
    }

    // ⬇️(3) Client의 HTTP 요청 url이 무엇인지 알아낸다.
    const url: string = req.originalUrl;

    const resourcePath: string = `.${url}`;
    this.logger.debug(`Resource 처리대상 [${method}] ${url}`);
    // ⬇️(4) 요청받은 resource가 서버에 있는지 확인한다.
    if (!resourcePath.includes('html') && FileUtil.exists(resourcePath)) {
      // ⬇️(5) 요청받은 resource의 확장자를 확인한다.
      const extension: string = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

      // ⬇️(6) 요청받은 resource에 대한 metadata를 HTTP 응답 header를 지정한다.
      const contentType = mimeTypes[extension];
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        res.setHeader('Content-Type', 'application/json');
      }

      return res.send(FileUtil.readFileBytes(resourcePath));
    } else {
      this.logger.debug(`요청한 resource 가 없습니다.`);
      // ⬇️(Resource 없음) Client가 요청한 resource가 없는 경우 404 응답을 반환한다.
      res.setHeader('Content-Type', 'application/json');
      res.status(404);
      return res.send(
          JSON.stringify({
            message: `Cannot GET ${url}`,
            error: 'Not Found',
            statusCode: 404
          })
      );
    }
  }
}

const mimeTypes = {
  text: 'text/plain',
  txt: 'text/plain',
  htm: 'text/html',
  html: 'text/html',
  json: 'application/json',
  jsonp: 'application/json',
  css: 'text/css',
  js: 'text/javascript',
  ico: 'image/x-icon',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  mp3: 'image/mpeg',
  mp4: 'image/mp4',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  woff: 'font/woff',
  woff2: 'font/woff2',
  map: 'application/json'
} as const;