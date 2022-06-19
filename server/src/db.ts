import * as sqlite3 from "sqlite3";
import * as fs from "fs";

let table_name: string = "simpleTable"; //테이블 이름 입니다.
let db: sqlite3.Database; //db 객체 입니다.(sqlite)
const db_path: string = "./my.db"; //db저장 위치 입니다.

//데이터 저장 타입 입니다.
type DBform = {
  idx?: number;
  name: string;
  desc?: string;
  date: string;
  file_path?: string;
};

//#1. db파일이 저장될 위치를 만듭니다.
function _init(): Promise<any> {
  return new Promise((succ: Function, fail: Function) => {
    fs.readFile(db_path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      try {
        if (err) {
          fs.writeFileSync(db_path, "");
        }
        succ("succ");
      } catch (error) {
        fail("fail");
      }
    });
  });
}

//#2. db객체를 생성하고, 테이블을 조사한뒤 없으면 만들어 줍니다.
function init(calback?: Function): void {
  _init()
    .then((arg) => {
      db = new sqlite3.Database(db_path);
      db.run(
        `CREATE TABLE IF NOT EXISTS ${table_name}(idx INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, desc TEXT, date TEXT, file_path TEXT)`,
        (res: sqlite3.RunResult, err: Error) => {
          if (err) throw new Error("db create error!");
          if (calback) calback();
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

//#3. 가져오기 함수 입니다.
function select(calback?: Function): void {
  db.all(`SELECT * FROM ${table_name} `, (result: any, error: Error) => {
    if (calback && calback instanceof Function) calback(result, error);
  });
}

//#4. 등록 함수 입니다.
function insert(param: DBform, calback?: Function): void {
  db.run(
    `INSERT INTO ${table_name}( name, desc, date, file_path ) VALUES('${param.name}','${param.desc}','${param.date}','${param.file_path}')`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

//#5. 수정 함수 입니다.
function update(param: DBform, calback?: Function): void {
  db.run(
    `UPDATE ${table_name} SET name='${param.name}', desc='${param.desc}' WHERE idx = '${param.idx}'`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

//#6. 삭제 함수 입니다.
function remove(idx: string, calback?: Function): void {
  db.run(
    `DELETE FROM ${table_name} WHERE idx = '${idx}'`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

export default init;
export { select, insert, update, remove };
export type { DBform };
