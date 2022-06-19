# 리엑트와 익스프레스 서버
+ 리엑트와 익스프레스 서버로 만든 간단한 대쉬보드 입니다.
+ 파일을 저장할 수 있도록 간단하게 드래그(Drag) 앤 드랍(Drop) 기능을 추가하였습니다.
+ 스타일은 간단하게 구분할 수 있는 정도만 적용되어 있습니다.
+ 기본 틀 작업이나 개념잡기 목적으로 작업하였습니다.
+ 구동중인 모습
![image](https://user-images.githubusercontent.com/17187262/174483470-3e02faf3-f63e-46ed-b6ba-56f9dc230c4f.png)
## 
+ 리엑트(React)
  + 구조는 함수형을 따르고 있으며, hook-form, redux 및 axios 라이브러리를 사용 하였습니다.
  + 프록시 설정을 통하여 익스프레스 서버와 통신을 합니다.
  + 등록된 글 수정 기능에서의 "파일수정, 삭제" 기능은 없습니다.
  + <span style="color:blue">실행 방법</span> : (app 폴더로 이동 후) npm run start
  + 리엑트 package.json 항목
```
{
  "name": "app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@reduxjs/toolkit": "^1.8.1",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.2.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.27.2",
    "http-proxy-middleware": "^2.0.6",
    "react": "^18.1.0",
    "react-dom": "^18.1.0",
    "react-hook-form": "^7.31.2",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "react-use-websocket": "^3.0.0",
    "redux-actions": "^2.6.5",
    "redux-devtools-extension": "^2.13.9",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```
## 
+ 익스프레스(Express)
  + 타입스크립트(Typescript) 기반으로 작업하였습니다.
  + 데이터 베이스는 간단하게 SQLITE를 사용하였습니다.
  + 뷰 템플릿은 ejs, 파일 저장은 multer 라이브러리를 사용 하였습니다.
  + <span style="color:blue">실행 방법</span> : (server 폴더로 이동 후) npm run start
  + 익스프레스 package.json 항목
```
{
  "name": "tsc_prj",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "tsc && node ./dist/index.js",
    "db_test": "tsc && node ./dist/db.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.0",
    "ejs": "^3.1.8",
    "express": "^4.18.1",
    "fs": "^0.0.1-security",
    "multer": "^1.4.5-lts.1",
    "sqlite3": "^5.0.8",
    "typescript": "^4.6.4"
  },
  "devDependencies": {
    "@types/multer": "^1.4.7",
    "@types/express": "^4.17.13",
    "@types/sqlite3": "^3.1.8"
  }
}

```
