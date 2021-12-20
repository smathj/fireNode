var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');


var server = http.createServer((req, res) => {
    fs.readFile('HTMLPage.html', (err, data) => {
        res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf8'});
        res.end(data);
    });
}).listen(8080, (() => {
    console.log('8080번 포트에서 소켓 서버 실행중');
}));

var io = socketio.listen(server);

io.sockets.on('connection', (socket) => {
    console.log('클라이언트와 연결완료');

    var roomName = null;

    // join 이벤트
    socket.on('join',(data) => {
        roomName = data;
        socket.join(data);   // join이라는 소켓 이벤트를 발생시키면, 클라이언트를 방에 넣는다
    })

    // message 이벤트
    socket.on('message', (data) => {
        io.sockets.in(roomName).emit('message', 'test');
    });
    // socket.on('A',(data) => {
    //     console.log('Client Send Data:', data);
        // 처음꺼
        // socket.emit('B', data);

        // public 통신
        // io.sockets.emit('B', data);

        // boardcast 통신
        // socket.broadcast.emit('B', data);

    // });
})

