const express = require('express');
const expressSession = require('express-session');
const dotenv = require('dotenv').config();
const db = require('./database/CRUD');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const url = require('url');
const path = require('path');
const axios = require('axios');

const usersRouter = require('./router/users.js');
const joinRouter = require('./router/join.js');
const loginRouter = require('./router/login.js');
const boardRouter = require('./router/board.js');
const fileRouter = require('./router/file.js');


const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname,'public')));

app.use(cookieParser(process.env.cookieSecket));
app.use(express.json());
app.use(express.urlencoded({ extended : true}));    // 구 bodyParser.urlencoded({ extended : true})

// 메모리 세션
app.use(expressSession({
	resave : false,
	saveUninitialized : false,
	secret : process.env.cookieSecket,
    cookie : {
        httpOnly : true,
        secure : false,
        maxAge : 60 * 1000

    }
}));

console.log('쿠키 시크릿 :',process.env.cookieSecket);

app.set('views', path.resolve(__dirname,'views'));
app.set('view engine','ejs');



db.init();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
    // res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf8'}, {'Set-Cookie' : `test=${req.session.count}`});

    // jwt 사용중
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf8'});
    res.write('<a href="/login">로그인 하러가기</a><br>');
    res.write('<a href="/join">회원가입 하러가기</a><br>');
    res.end();
    
})



app.use('/login', loginRouter);

app.use('/join', joinRouter);

app.use('/users', usersRouter);

app.use('/file', fileRouter);

app.get('/logout', (req,res) => {
    res.clearCookie('user');
    res.redirect('/login');
})

app.use('/board', boardRouter);

app.get('/socket', (req,res) => {
    // res.clearCookie('user');
    // res.redirect('/login');
    res.sendFile(__dirname + '/views/index.html');
})


app.use((req,res,next) => {
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf8'});
    res.write('해당 요청의 서비스는 존재하지 않습니다.');
    res.end();
})

// 에러처리 미들웨어
app.use((err, req, res, next) => {
    console.log('--------------- [ 에러가 발생 했습니다 ] --------------');
    console.error(err);
    res.status(500);
    res.end();
    console.log('-------------------------------------------------------');
})
app.listen(8080);



