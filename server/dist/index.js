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
//파일 저장관련
const FILE_PATH = "uploads/";
const upload = multer({ dest: FILE_PATH });
//기본 뷰 페이지
app.all("/", (req, res) => {
    res.render("index.html", { title: "Welcome" });
});
//데이터 가져오기 기능
app.all("/data/getList", (req, res) => {
    (0, db_1.select)((error, result) => {
        res.send({ result: JSON.stringify(result) });
    });
});
//등록 기능
app.post("/data/insert", upload.any(), (req, res) => {
    let { parent_idx = -1, name, desc, date = new Date().toString(), } = req.body;
    console.log("insert ok");
    let file_path = [];
    if (req.files) {
        for (let index in req.files) {
            let file = req.files[index];
            let { originalname: orgNm, filename, destination } = file;
            let tail = orgNm.substring(orgNm.lastIndexOf("."));
            file_path.push({ filename, tail, destination });
        }
    }
    (0, db_1.insert)({ parent_idx, name, desc, date, file_path: JSON.stringify(file_path) }, (result, error) => {
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//수정 기능
app.all("/data/update", (req, res) => {
    let { name, desc, date = new Date().toString() } = req.body;
    (0, db_1.update)({ name, desc, date }, (result, error) => {
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//삭제 기능
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
//파일 다운로드 기능
app.all("/data/download/:fileId/:tail", (req, res) => {
    const file = `${FILE_PATH}/${req.params.fileId}`;
    res.download(file, `${req.params.fileId}.${req.params.tail}`);
});
//#9. 서버를 실행 합니다.
app.listen(4885, () => {
    console.log("실행중");
});
