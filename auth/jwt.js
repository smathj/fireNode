const jwt = require('jsonwebtoken');


let token = jwt.sign(
    {
        test : '테스트 토큰내용'
    },
    '짖어',
    {
        expiresIn : '3s'    
    }
);

jwt.verify(token,'짖어',(error, result) => {
    console.log('--------------------------------------');
    console.log(`error`);
    console.log(error);
    console.log('--------------------------------------');
    console.log(`result : `);
    console.log(result);
    console.log('--------------------------------------');
})

console.log(token);