const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');
const dotenv = require('dotenv').config();
const upload = multer({
    //저장소
    storage : multer.diskStorage({
        // 경로
        destination(req,file,done) {
            done(null,'public/upload');
        },
        filename(req, file, done) {
            // 확장자 가져오기
            const ext = path.extname(file.originalname);
            // 업로드 파일명 = 파일이름 + 시간 + 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    // limits : { fileSize : 1024 * 1024 * 1024 * 1024 }
});




router.use(cookieParser())
// router.use(fileUpload())
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

router.get('/list',(req, res) => {
    fs.readdir('public/upload', 'utf-8', (error, result) => {
        console.log(result);
        if(error) {
            res.end();
        } else {
            res.render('../views/fileList', { fileList : result});
        }
    });
});

router.get('/download/:fileName',(req, res) => {
    let fileName = req.params.fileName;
    let charFilename = encodeURIComponent(fileName);
    let filePath = `${process.env.INIT_CWD}/public/upload`;
    console.log('fileName =>', fileName);
    console.log('charFilename =>', charFilename);
    console.log('filePath =>', filePath);

    res.setHeader('Content-Disposition', `attachment; filename=${charFilename}`);
    res.sendFile(`${filePath}/${fileName}`);    


    //express 다운로드
    // res.download(filePath, charFilename);// 실패
});


router.get('/upload',(req, res) => {
    res.render('../views/upload');
});

router.post('/upload',  upload.array('files', 10),
(req, res, err) => {
    console.log('req.files ==>', req.files);
    console.log('req.body ==>', req.body);// title(input)을 읽는다
    console.log(err);
    res.send('업로드 성공');


});

module.exports = router;
 