const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const router = express.Router();

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


router.get('/', (req, res) => {
        connection.query('SELECT * FROM USERS', (err, results) => {
            users = results;
            res.render(`../views/users`, {data : users});
        });  
})


module.exports = router;