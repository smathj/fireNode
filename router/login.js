const express = require('express');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// 로그인 화면
router.get('/', (req, res) => {
    res.render(`../views/login`, { message : undefined});
});

// 로그인 진행
router.post('/',
            (req, res, next) => {
            let queryArr = [req.body.id, req.body.password];

            connection.query('SELECT * FROM USERS WHERE id=? AND password=?',queryArr, (err , results) => {
                if(results.length) {
                    if(results.length === 1) {
                        // JSON Web Token 생성 //
                        let token = jwt.sign(
                            { user : `${req.body.id}` },
                            process.env.JSON_WEB_TOKEN_SECKET,
                            { expiresIn : '10m' }
                        );
                        
                        jwt.verify(token,process.env.JSON_WEB_TOKEN_SECKET,(error, result) => {
                            console.log(error);
                            console.log(result);
                        })
                        res.cookie("user",token, {
                            httpOnly : true,
                        });
    
                        // let user = {
                        //     id : req.body.id
                        // }
                        // res.cookie("user",user, {
                        //     maxAge : 60 * 60 * 1000,
                        //     httpOnly : true,
                        //     path : '/'
                        // });
                        res.redirect('/users');
    
                    }
                }    

            });
});    

module.exports = router;