const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv').config();
// 회원가입 폼
router.get('/', (req, res) => {
    res.render(`../views/joinForm`, { message : null});
})

// 회원가입
router.post('/',
        [
            body('id').notEmpty().isLength({ min : 2}).withMessage("아이디는 2글자 이상"),
            body('password').notEmpty().isLength({ min : 2}).withMessage("비밀번호는 2글자 이상"),
        ],
            (req,res,next) => {
                console.log(1);
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    console.log('errors');
                    console.log(errors);
                    return res.status(400).json({ message: errors.array() });
                } else {
                    next();
                }
            },
            (req, res) => {
            let queryArr = [req.body.id, req.body.password, req.body.name, req.body.job, req.body.email];
            // DB 추가
            connection.query('INSERT INTO USERS (id, password, name, job, email) VALUES(?, ?, ?, ?, ?)',queryArr);
            // DB에 추가되었으니 토큰 발행
            let token = jwt.sign(
                { user : `${req.body.id}` },
                process.env.JSON_WEB_TOKEN_SECKET,
                { expiresIn : '5m' }
            );
            
            jwt.verify(token,process.env.JSON_WEB_TOKEN_SECKET,(error, result) => {
                console.log(error);
                console.log(result);
            })
            res.cookie("user",token);
            res.redirect('/users');
})

module.exports = router;