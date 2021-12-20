const mysql = require('mysql2');

exports.connection;
let queryResult = null;
// mysql2도 Promise 기반이다
exports.init = function() {
        connection = mysql.createConnection({
        host : 'localhost',
        port : 3306,
        user : 'root',
        password : '1234',
        database : 'firenode',
    });

    connection.connect((err) => {
        console.log('-------------[DATABASE CONNECTION START]--------------');
        console.log('------------------------------------------------------');
        if(!err) {
            console.log('         firenode 데이터 베이스 연결 성공!');
        } else {
            console.log('         firenode 데이터 베이스 연결 실패!');
        }
        console.log('------------------------------------------------------');
        console.log('-------------[DATABASE CONNECTION END]----------------');
    });
};

// exports.query = function (sql, paramArr) {
//     console.log(paramArr);
//     if(paramArr != null) {
//          connection.query(sql,paramArr,(err,result,fields) => {
//             // console.log(`${sql} Result`);
//             // console.log(result);
//             queryResult = result;

//         });        
//     } else {
//         // select
//         connection.query(sql,(err,result,fields) => {
//             // console.log(`${sql} Result`);
//             // console.log(result);
//             queryResult = result;
//         });
//     }

// };

// exports.getResult = function () {
//     return queryResult;
// };