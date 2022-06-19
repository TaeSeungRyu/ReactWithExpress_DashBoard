"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer = require("multer");
const db_1 = require("./db");
//서버 기본 설정 입니다.
const app = express();
//뷰 설정 입니다.
app.set("views", "D:/reactDashBoard/server/html");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
//app.use(express.static(__dirname + '/public'));
//데이터베이스를 설정 합니다.
(0, db_1.default)();
//post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
//파일 저장관련 설정 입니다.
const FILE_PATH = "uploads/";
const upload = multer({ dest: FILE_PATH });
//기본 뷰 페이지 입니다.
app.all("/", (req, res) => {
    res.render("index.html", { title: "Welcome" });
});
//데이터 가져오기 기능 입니다.
app.all("/data/getList", (req, res) => {
    (0, db_1.select)((error, result) => {
        res.send({ result: JSON.stringify(result) });
    });
});
//데이터 등록 기능 입니다.
/**
 * Multer 라이브러리를 사용하여 파일을 같이 받게 하였습니다.
 */
app.post("/data/insert", upload.any(), (req, res) => {
    let { name, desc, date = new Date().toString() } = req.body; //1) 파라미터를 받습니다.
    let file_path = [];
    if (req.files) {
        //2) Multer 라이브러리를 통해 Request객체어 files 속성이 추가됩니다.
        for (let index in req.files) {
            //3) 저장할 파일을 담습니다.
            let file = req.files[index];
            let { originalname: orgNm, filename, destination } = file;
            let tail = orgNm.substring(orgNm.lastIndexOf("."));
            file_path.push({ filename, tail, destination });
        }
    }
    (0, db_1.insert)(
    //4) 데이터를 저장합니다.
    { name, desc, date, file_path: JSON.stringify(file_path) }, (result, error) => {
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//데이터 수정 기능 입니다.
app.all("/data/update", (req, res) => {
    let { name, desc, date = new Date().toString(), idx } = req.body;
    (0, db_1.update)({ name, desc, date, idx }, (result, error) => {
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//데이터 삭제 기능 입니다.
app.all("/data/remove", (req, res) => {
    let { idx } = req.body;
    (0, db_1.remove)(idx, (result, error) => {
        console.log(result, error);
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//파일 다운로드 기능 입니다.
/*
 * 실제로 파일 이름이나 형식, 경로로 요청되는 주소 패턴은 웹 취약점 항목이므로 주의해야 합니다.
 * 웹 표준 취약점 : 파일 다운로드(FD)
 */
app.all("/data/download/:fileId/:tail", (req, res) => {
    const file = `${FILE_PATH}/${req.params.fileId}`;
    res.download(file, `${req.params.fileId}.${req.params.tail}`);
});
//#9. 서버를 실행 합니다.
app.listen(4885, () => {
    console.log("실행중");
});
