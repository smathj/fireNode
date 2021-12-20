var EventEmitter = require('events');
var custom = new EventEmitter();

// 사용자 정의 이벤트 
custom.on('natae',() => {
    console.log('나태 이벤트 호출');
});

// custom.emit('natae');

// setInterval(() => {
//     custom.emit('natae');
// },1000);