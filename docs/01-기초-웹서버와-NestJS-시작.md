## 1단계: 웹서버 동작 원리와 NestJS 시작하기 (기초)

학습 목표
- HTTP 요청/응답의 기본 흐름을 이해한다. (HTTP는 웹에서 데이터를 주고받는 기본 규칙으로, 요청은 '내가 이걸 원해'라고 하는 거고 응답은 '여기 있어'라고 답하는 거예요. 마치 레스토랑에서 주문하고 음식을 받는 과정처럼요.)
- NestJS 프로젝트 구조와 부트스트랩 과정을 이해한다. (부트스트랩은 앱을 '켜는' 과정으로, 자동차 시동 걸기처럼 앱이 작동할 준비를 해줍니다.)
- 정적 리소스(HTML/CSS/이미지) 제공 흐름을 체험한다.

사전 준비
- Node.js LTS 설치 (LTS는 안정적인 장기 지원 버전으로, 초보자라면 공식 사이트에서 다운로드해 설치하세요. Node.js는 자바스크립트로 서버를 만들 수 있게 해주는 도구예요.)
- PowerShell (Windows)에서 명령 실행

프로젝트 개요
- 본 예제는 NestJS로 “정적 리소스 제공”을 직접 구현해보며 웹서버의 기본 원리를 학습하기 위한 프로젝트이다. (정적 리소스는 변하지 않는 파일들, 예를 들어 HTML 페이지나 이미지처럼요. 웹서버는 이런 파일들을 사용자에게 보여주는 역할을 합니다.)
- 핵심 파일
  - `src/main.ts`: 애플리케이션 부트스트랩
  - `src/app.module.ts`: 모듈 구성 및 커스텀 미들웨어 등록
  - `src/app.controller.ts`: 루트 경로(`/`)에서 `assets/index.html` 반환
  - `src/resource-response/resource-response.middleware.ts`: `/assets/**` 정적 리소스 직접 서빙
  - `src/utils/file-util.utils.ts`: 파일 읽기 유틸리티

프로젝트 구조 한눈에 보기
- 실행 진입점: `src/main.ts` (이 파일이 앱의 '시작 버튼' 역할을 해요. 앱을 만들고 포트를 열어 외부 요청을 기다립니다.)
  - Nest 앱을 생성하고 포트를 열어 대기한다.
  - 포트는 환경변수 `PORT`가 없으면 3000번 사용.
- 모듈: `src/app.module.ts`
  - `ConfigModule.forRoot({ isGlobal: true })`로 환경설정 로딩
  - `ResourceResponseMiddleware`를 `/assets` 경로에 적용하여 정적 리소스 요청을 직접 처리
- 컨트롤러: `src/app.controller.ts`
  - `GET /` 요청 시 `./assets/index.html` 파일을 문자열로 읽어 그대로 반환
- 미들웨어: `src/resource-response/resource-response.middleware.ts`
  - `GET /assets/...` 요청을 받아 파일 존재 여부 확인, MIME 타입 설정, 바이트 전송 또는 404 JSON 응답
- 유틸: `src/utils/file-util.utils.ts`
  - 동기 방식으로 파일을 읽고 존재 여부를 확인하는 단순 함수 제공

실습 1: 프로젝트 실행하기
1) 의존성 설치 (의존성은 앱이 필요로 하는 다른 프로그램 조각들로, npm install로 자동 다운로드됩니다.)
```powershell
cd board
npm install
```
2) 개발 서버 실행
```powershell
npm run start:dev
```
3) 브라우저에서 접속
- `http://localhost:3000` → 루트 페이지에 “라퓨타의 페이지”와 이미지가 보인다.
- 정적 리소스 경로도 직접 확인해본다:
  - `http://localhost:3000/assets/index.html`
  - `http://localhost:3000/assets/css/index.css`
  - `http://localhost:3000/assets/images/city_night.jpg`

실습 2: 포트 변경해보기 (환경변수)
- 이 프로젝트는 `src/main.ts`에서 `process.env.PORT ?? 3000`을 사용한다.
- PowerShell에서 일시적으로 포트를 4000으로 바꿔 실행
```powershell
$env:PORT=4000; npm run start:dev
```
- 이제 `http://localhost:4000`으로 접속된다.

실습 3: 요청-응답 흐름 따라가기
- 루트 요청 `/`
  1. Express → 미들웨어 체인 시작
  2. `/assets`가 아니므로 커스텀 미들웨어는 패스
  3. 컨트롤러 `AppController.getResource()`가 `./assets/index.html`을 문자열로 읽어 반환
- 정적 리소스 요청 `/assets/css/index.css`
  1. 커스텀 미들웨어가 요청 메소드/경로 검사
  2. 실제 파일 존재 여부 확인 후 MIME 타입(`text/css`) 설정
  3. 바이트 스트림을 응답으로 전송

개념 정리: NestJS 요청 처리 순서
- 프로젝트 주석에 안내된 기본 순서 (이 순서는 요청이 앱 안으로 들어와 처리되는 '조립 라인'처럼 단계별로 진행됩니다. 각 단계에서 특정 작업을 해요.)
  - 미들웨어(Middleware)
  - 가드(Guard)
  - 인터셉터(Interceptor)
  - 파이프(Pipe)
  - 컨트롤러(Controller) / 핸들러(Handler)
  - 서비스(Service)
- 본 예제는 “정적 리소스 응답”을 컨트롤러 이전 단계인 미들웨어에서 처리하는 방식을 보여준다.

체크포인트
- 서버가 정상 기동되고 루트 페이지가 보였는가? (기동은 서버가 켜지는 걸 의미해요. 브라우저에서 페이지가 제대로 보이면 성공!)
- `/assets/**` 경로가 미들웨어에서 처리되어 리소스가 내려오는가?

도전 과제
- 환경변수 파일(.env)을 추가해 `PORT`를 고정 설정해보고, 설정값이 적용되는지 확인한다.
- `assets/index.html` 문구나 이미지를 바꾼 뒤 새로고침 동작을 확인한다.


