const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

let cookie1 = '첫번째 쿠키';
let cookie2 = '두번째 쿠키';
let cookieObj = {};

var server = http.createServer((req, res) => {

    // res.writeHead(200, { 
    //     'Content-Type' : 'text/html; charset=utf8',
    //     'Set-Cookie' : [`cookie1 = ${encodeURIComponent(cookie1)}`,`cookie2 = ${encodeURIComponent(cookie2)}`]
    // });

    
    if(req.headers.cookie !== undefined) {
        console.log('쿠키가 존재합니다.');
        var cookies = req.headers.cookie.toString().split("; ");
        console.log(cookies);

        for(let i in cookies) {

            var cookieName = cookies[i].split('=')[0];

            var cokkieValue = decodeURIComponent(cookies[i].split('=')[1]);
            cookieObj[cookieName] = cokkieValue;
        }
        console.log(cookieObj);
    } else {
        console.log('쿠키가 없습니다.');
    }
    
    fs.readFile('views/ejsPage.ejs', 'utf8', (err, data) => {
        res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf8;'})
        res.end(ejs.render(data, { test : cookieObj }));
    })
    // res.write(`<h1>${cookieObj.cookie1}</h1>`);
    // res.end(`<h1>${cookieObj.cookie2}</h1>`);
});

server.listen(8080, () => {
    console.log('8080번 포트에서 http 서버 실행');
});

var test = function() {
    server.close();
}

server.on('connection', () => {
    console.log('클라이언트가 접속했습니다.');
})

server.on('close', () => {
    console.log('서버가 종료됩니다.');
})

// setTimeout(() => {
//     test();
// }, 2000);
