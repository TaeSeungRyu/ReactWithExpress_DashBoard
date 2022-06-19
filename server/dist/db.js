"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.insert = exports.select = void 0;
const sqlite3 = require("sqlite3");
const fs = require("fs");
let table_name = "simpleTable"; //테이블 이름 입니다.
let db; //db 객체 입니다.(sqlite)
const db_path = "./my.db"; //db저장 위치 입니다.
//#1. db파일이 저장될 위치를 만듭니다.
function _init() {
    return new Promise((succ, fail) => {
        fs.readFile(db_path, (err, data) => {
            try {
                if (err) {
                    fs.writeFileSync(db_path, "");
                }
                succ("succ");
            }
            catch (error) {
                fail("fail");
            }
        });
    });
}
//#2. db객체를 생성하고, 테이블을 조사한뒤 없으면 만들어 줍니다.
function init(calback) {
    _init()
        .then((arg) => {
        db = new sqlite3.Database(db_path);
        db.run(`CREATE TABLE IF NOT EXISTS ${table_name}(idx INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, desc TEXT, date TEXT, file_path TEXT)`, (res, err) => {
            if (err)
                throw new Error("db create error!");
            if (calback)
                calback();
        });
    })
        .catch((err) => {
        console.log(err);
    });
}
//#3. 가져오기 함수 입니다.
function select(calback) {
    db.all(`SELECT * FROM ${table_name} `, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.select = select;
//#4. 등록 함수 입니다.
function insert(param, calback) {
    db.run(`INSERT INTO ${table_name}( name, desc, date, file_path ) VALUES('${param.name}','${param.desc}','${param.date}','${param.file_path}')`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.insert = insert;
//#5. 수정 함수 입니다.
function update(param, calback) {
    db.run(`UPDATE ${table_name} SET name='${param.name}', desc='${param.desc}' WHERE idx = '${param.idx}'`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.update = update;
//#6. 삭제 함수 입니다.
function remove(idx, calback) {
    db.run(`DELETE FROM ${table_name} WHERE idx = '${idx}'`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.remove = remove;
exports.default = init;
