# 프로젝트 소개
스카이스캐너 API를 이용한 항공권 검색기능과 현지의 가이드가 상품을 올리면  
일반 유저가 상품을 구매할 수 있도록 하는 가이드 서비스 기능이 결합된 웹 어플리케이션을  
Vue.js + Express + MongoDB를 사용하여 구현한 프로젝트입니다.

# 기술스택
### 1. Front-End  
   `Vue` `Vuex` `Vuetify`
   `HTML` `CSS` `JavaScript`

### 2. Back-End  
  `Node.js` `Express`
  `MongoDB` `Mongoose`

### 3. API  
  `SkyScanner` `KakaoPay`
  `Swagger` `Google OAuth`

### 4. Management Tools  
  `Git` `Jira`

# 핵심기능
## 1. 회원가입 및 로그인  
![1 LoginGIF](https://user-images.githubusercontent.com/51772104/70696830-cbd60980-1d07-11ea-9607-65c4c1af47dd.gif)
 - 버튼을 통해 클릭 한 번으로 가이드와 유저를 전환하여 접속가능
 - 처음 구글 로그인 시 자동 회원가입
 - Google OAuth 인증 및 SSO(Single Sign On) 적용

## 2. 항공권 검색  
![2 AirportSearchGIF](https://user-images.githubusercontent.com/51772104/70696861-ddb7ac80-1d07-11ea-812a-3782330d32fa.gif)
 - 스카이스캐너 API 사용한 검색
 - 경유, 출발시간, 항공사, 소요시간 필터링 및 최저가, 최단시간 순 정렬 기능
 - 항공권 예약사이트 링크와 연결

## 3. 가이드 상품
## 유저 로그인 시  
### 1) 검색  
![3-1 GuideServiceSearchGIF](https://user-images.githubusercontent.com/51772104/70696901-ee682280-1d07-11ea-81c0-5c0b49427327.gif)
 - 태그, 날짜, 가격 및 기간별 필터링 기능

### 2) 결제
![3-2 GuideServicePaymentGIF](https://user-images.githubusercontent.com/51772104/70696969-0e97e180-1d08-11ea-94d7-9547187a5762.gif)
 - 카카오 페이 API 모의결제기능 구현

## 가이드 로그인 시  
### 3) 등록 및 수정
![3-3 GuideServiceCreateGIF](https://user-images.githubusercontent.com/51772104/70697009-1ce5fd80-1d08-11ea-9a5d-1972d12b87c8.gif)
 - 태그, 금액, 여행 기간 등을 사용한 필터링
 - 가이드 상품 좋아요 기능 구현

### 4) 가이드 상품 일정 확인 및 수정  
![3-4 GuideServiceExfired](https://user-images.githubusercontent.com/51772104/70697041-28d1bf80-1d08-11ea-849c-6af94fbc8386.gif)
 - 게시한 가이드 상품을 캘린더에서 한 눈에 확인할 수 있습니다.
 - 가이드 상품 종료 시 해당 상품 구매자들 또한 만료처리 됩니다.  

# 부가기능
### 1. 채팅
 - Socket.io을 사용한 가이드와 유저의 실시간 1:1 채팅방 구현
 - 과거 채팅 기록 저장을 위한 채팅 내용을 MongoDB에 저장
 - 상품 결제 시 가이드가 유저에게 자동 결제메시지 전송

### 2. 리뷰와 평점 작성 및 수정
 - 양질의 서비스 제공을 위한 가이드 상품 사용자의 후기 작성 기능

### 3. 피드백
 - 사용자들의 개선사항 또는 불만사항을 피드백을 관리자 메일로 전송

# 프로젝트 시연영상
  아래 이미지를 클릭하시면 유튜브에서 프로젝트의 시연영상을 보실 수 있습니다.  
  [![Video Label](http://img.youtube.com/vi/V8oHkEDfFNY/0.jpg)](https://youtu.be/V8oHkEDfFNY?t=0s)

# 업무분장
## Back-End
### 👤 고병석(Back-End)
1. DB 스키마 모델링(회원, 항공, 결제시스템, 가이드 상품 좋아요 기능)과 API 구현
2. Google OAuth 토큰 방식 인증 및 SSO(Single Sign On) 적용
3. 카카오페이 연동
4. 데이터 파싱 및 메일 전송 기능
5. Express를 이용한 서버 구축 및 서버와 DB연동 등 Back-End 전반

### 👤 류정관(Back-End)
1. DB 스키마 모델링(가이드 상품, 리뷰, 태그, 채팅) 및 API 구현
2. Front-End Engineer와의 협업을 위한 Swagger API 구현
3. 웹 소켓 모듈(Socket.io)을 사용한 유저와 가이드의 1:1 채팅방 구현
4. 국가별 화폐단위 크롤링

## Front-end
### 👤 강혜리(Front-End)
1. 항공권 디테일 페이지 구현
2. 유저 마이 페이지 구현
3. 작성 및 수정 폼 구현
4. 항공권 검색 시 우측 가이드 상품 광고 배너 구현
5. 기획 전반 및 테스트

### 👤 정세민(Front-End)
1. SkyScanner API를 이용한 항공권 검색 시 정렬 및 필터링 기능 구현
2. 항공권 리스트 페이지
3. 가이드 상품 디테일 페이지
4. 가이드 상품 리스트 페이지

# 협업 방식
1. 애자일 방식의 스크럼을 도입하여 매일 아침 15분 간 우선순위 및 이슈에 대해 회의를 진행하였음
2. 스크럼 마스터를 일주일 간격으로 교체하여 모두가 최소 한 번 이상 팀 단위의 이슈를 인지하도록 하였음
3. 이슈 추적 소프트웨어인 지라(Jira)를 통한 팀원 개개인의 진행상황과 이슈를 파악하였음
4. 깃(Git)을 통해 각자의 브랜치에서 작업한 코드를 기능 단위로 Master 브랜치로 병합(Merge)하였음
5. 스웨거 API를 통해 Front-End 개발자로 하여금 Back-End의 API를 테스트 할 수 있도록 하였음

# How to Start
backend 폴더에 config.js, kakaosecret.js 파일(MongoDB Google Kakao Secret Key 포함)이 추가로 필요하지만 개인정보 보호를 위해 첨부하지 않아 해당 소스코드만으로는 정상적인 실행이 불가합니다.

```bash
/bision_project

$ npm install
$ npm run serve
```

```bash
/backend

$ npm install
$ npm start
```
