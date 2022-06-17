import * as express from "express";
import * as bodyParser from "body-parser";
import * as ejs from "ejs";
import * as multer from "multer";

import init, { select, insert, update, remove } from "./db";

//서버 기본 설정 입니다.
const app: express.Application = express();

//뷰 설정 입니다.
app.set("views", "D:/reactDashBoard/server/html");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
//app.use(express.static(__dirname + '/public'));

//데이터베이스를 설정 합니다.
init();

//post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//파일 저장관련
const FILE_PATH: string = "uploads/";
const upload: multer.Multer = multer({ dest: FILE_PATH });

//기본 뷰 페이지
app.all("/", (req: express.Request, res: express.Response) => {
  res.render("index.html", { title: "Welcome" });
});

//데이터 가져오기 기능
app.all("/data/getList", (req: express.Request, res: express.Response) => {
  select((error, result) => {
    res.send({ result: JSON.stringify(result) });
  });
});

//등록 기능
app.post(
  "/data/insert",
  upload.any(),
  (req: express.Request, res: express.Response) => {
    let {
      parent_idx = -1,
      name,
      desc,
      date = new Date().toString(),
    } = req.body;
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

    insert(
      { parent_idx, name, desc, date, file_path: JSON.stringify(file_path) },
      (result, error) => {
        if (error) {
          res.send({ result: "error" });
        } else {
          res.send({ result: "succ" });
        }
      }
    );
  }
);

//수정 기능
app.all("/data/update", (req: express.Request, res: express.Response) => {
  let { name, desc, date = new Date().toString() } = req.body;
  update({ name, desc, date }, (result, error) => {
    if (error) {
      res.send({ result: "error" });
    } else {
      res.send({ result: "succ" });
    }
  });
});

//삭제 기능
app.all("/data/remove", (req: express.Request, res: express.Response) => {
  let { idx } = req.body;
  remove(idx, (result, error) => {
    console.log(result, error);
    if (error) {
      res.send({ result: "error" });
    } else {
      res.send({ result: "succ" });
    }
  });
});

//파일 다운로드 기능
app.all(
  "/data/download/:fileId/:tail",
  (req: express.Request, res: express.Response) => {
    const file = `${FILE_PATH}/${req.params.fileId}`;
    res.download(file, `${req.params.fileId}.${req.params.tail}`);
  }
);

//#9. 서버를 실행 합니다.
app.listen(4885, () => {
  console.log("실행중");
});
