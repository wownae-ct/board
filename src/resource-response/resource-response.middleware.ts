import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {Request, Response} from "express";
import * as path from "node:path";
import * as FileUtil from "../utils/file-util.utils"

// ⬇️ 정적 리소스를 제공할 기준(public) 디렉토리. 이 경로 밖으로는 절대 빠져나갈 수 없다.
const PUBLIC_ROOT: string = path.resolve(process.cwd());

// ⬇️ 외부로 노출해도 되는 최상위 경로만 허용한다. (그 외 .env, src, package.json 등은 차단)
const ALLOWED_TOP_LEVEL: ReadonlySet<string> = new Set(['assets', 'index.html']);

@Injectable()
export class ResourceResponseMiddleware implements NestMiddleware {
  // ⬇️ NestJS의 로그를 남기는 기능을 사용하기 위해 Logger 객체를 ResourceResponseMiddleware 클래스의 인스턴스화와 동시에 생성한다.
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
    this.logger.debug(`Resource 처리대상 [${method}] ${url}`);

    // ⬇️(4) URL에서 query/hash 제거 후 디코딩한다. (잘못된 인코딩은 차단)
    let pathname: string;
    try {
      pathname = decodeURIComponent(url.split('?')[0].split('#')[0]);
    } catch {
      return this.notFound(res, url);
    }

    // ⬇️(5) 요청 경로를 PUBLIC_ROOT 기준으로 정규화하여 '../' 등 경로 탈출(Path Traversal)을 차단한다.
    const resolved: string = path.resolve(PUBLIC_ROOT, '.' + pathname);
    const relative: string = path.relative(PUBLIC_ROOT, resolved);
    const isInsideRoot: boolean =
        relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
    const topLevel: string = relative.split(path.sep)[0];

    // ⬇️(6) PUBLIC_ROOT 안쪽이면서 화이트리스트에 포함된 경로만 정적 리소스로 제공한다.
    if (!isInsideRoot || !ALLOWED_TOP_LEVEL.has(topLevel)) {
      return next();
    }

    // ⬇️(7) 실제 파일이 존재하는 경우에만 제공한다. (디렉토리 요청 등은 제외)
    if (FileUtil.exists(resolved) && FileUtil.isFile(resolved)) {
      // ⬇️(8) 요청받은 resource의 확장자를 확인한다.
      const extension: string = pathname.substring(pathname.lastIndexOf('.') + 1).toLowerCase();

      // ⬇️(9) 요청받은 resource에 대한 metadata를 HTTP 응답 header로 지정한다.
      const contentType = mimeTypes[extension];
      res.setHeader('Content-Type', contentType ?? 'application/octet-stream');

      return res.send(FileUtil.readFileBytes(resolved));
    }

    return this.notFound(res, url);
  }

  // ⬇️ Client가 요청한 resource가 없는 경우 404 응답을 반환한다.
  private notFound(res: Response, url: string) {
    this.logger.debug(`요청한 resource 가 없습니다.`);
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
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  tiff: 'image/tiff',
  tif: 'image/tiff',
    woff: 'font/woff',
    woff2: 'font/woff2',
    map: 'application/json'
} as const;
