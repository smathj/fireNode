const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { redirect } = require('express/lib/response');
const dotenv = require('dotenv').config();


router.use(cookieParser())


router.use(express.json());
router.use(express.urlencoded({ extended : true}));
// 토근확인 미들웨어
router.use((req, res, next) => {
    const token = req.cookies.user;
    jwt.verify(token,process.env.JSON_WEB_TOKEN_SECKET,(error, result) => {
        if(error != null) {
            res.render('../views/login', { message : '세션이 끊겼습니다, 재로그인 부탁드립니다.' });
        } else {
            next();
        }
    })
})









    
    



// 게시글 생성폼
router.get('/create', (req, res) => {
        res.render(`../views/boardForm`, { message : null});    
})

// 게시글 생성
router.post('/create', (req, res) => {
    const token = req.cookies.user;
    const tokenObj = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECKET);
    console.log(tokenObj.user);    
    console.log(token);
    let boardArr = [tokenObj.user, req.body.title, req.body.contents];
    console.log(boardArr);

    connection.query('INSERT INTO BOARD (id, title, contents) VALUES(?, ?, ?)',boardArr, (err, results) => {
        console.log('[실행] INSERT INTO BOARD (id, title, contents) VALUES(?, ?, ?)');
        // console.log(results);
        // console.log('[INSERT 성공]');
        if(results.affectedRows == 1) {
            console.log('[INSERT 성공]');
            res.redirect('/board/1');
        } else {
            res.redirect('/board/create');
        }
    });
    // connection.query('SELECT * FROM BOARD', (err, results) => {
    //     console.log('[실행] SELECT * FROM BOARD');
    //     res.render(`../views/boardList`, { boardList : results });
    // });
})

// // 게시글 읽는 라우터
// router.post('/',
//             (req, res) => {
//             let queryArr = [req.body.id, req.body.password, req.body.name, req.body.job, req.body.email];
//             if(req.body.id.length > 0 && req.body.password.length > 0 ) {
//                 connection.query('INSERT INTO USERS (id, password, name, job, email) VALUES(?, ?, ?, ?, ?)',queryArr);    
//                 res.redirect('/users');
//             } else {
//                 res.render(`../views/joinForm`, { message : 'ID나 PASSWORD를 입력해주세요.' });
//             }
// })

// 게시글 보는 라우터
router.get('/:pageId', (req, res) => {
    

    let pageId = parseInt(req.params.pageId);
    const token = req.cookies.user;
    const tokenObj = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECKET);
    console.log(tokenObj.user);

    let totalCount;      // 전체 게시글 갯수
    let pagePerCount;    // 화면당 보여줄 갯수
    let bottomPageCount; // 바텀에 보여줄 버튼 갯수
    let offset;


    connection.query('SELECT COUNT(*) AS COUNT FROM BOARD', (err, results) => {
        console.log('[실행] SELECT COUNT(*) FROM BOARD');
        totalCount = results[0].COUNT;
        // 한화면당 보여줄 게시글 갯수 10개 고정
        pagePerCount = 10;
        bottomPageCount = Math.ceil(totalCount / pagePerCount);


        console.log('=============================================');
        console.log(`토탈 카운트 : ${totalCount}`);
        console.log(`화면당 보여줄 갯수 : ${pagePerCount}`);
        console.log(`바텀 버튼 갯수 : ${bottomPageCount}`);
        console.log(`offset  : ${offset}`);
        console.log('=============================================');
        if(pageId == 1) {
            offset = 0;
        } else {
            offset = (pageId-1)*10;
        }
        let needCount = pagePerCount * bottomPageCount - totalCount;

        console.log(`offset : ${offset}`);
            connection.query(`SELECT * FROM BOARD ORDER BY createdAt DESC LIMIT ${pagePerCount} OFFSET ${offset}`, (err, results) => {
                console.log(`[실행] SELECT * FROM BOARD ORDER BY createdAt DESC LIMIT ${pagePerCount} OFFSET ${offset}`);
                console.log(results);
                // 날자 포맷 변경
                const monthArr = [1,2,3,4,5,6,7,8,9,10,11,12];


                for(let i=0; i<results.length; i++) {
                    let year = results[i].createdAt.getFullYear();
                    let month = monthArr[results[i].createdAt.getMonth()];
                    let date = results[i].createdAt.getDate();
                    let hours = results[i].createdAt.getHours();
                    let minutes = results[i].createdAt.getMinutes();
                    let seconds = results[i].createdAt.getSeconds();
                    results[i].createdAt = year + "-" + month + "-" + date + "-" + hours + ":" + minutes + ":" + seconds;
                }
                console.log('++++++++++++++++++++++++++++++++++');
                console.log(results);
                if(results.length < 10) {
                    for(let i=0; i<needCount; i++) {
                        results.push({ id : ' ', title : ' ', contents : ' ', createdAt : ' ', updatedAt : null});
                    }
                }

                res.render(`../views/boardList`, { boardList : results, user : tokenObj.user, pageMaxPage : bottomPageCount });
            });
    
        })
    });

module.exports = router;