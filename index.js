var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	var uId = socket.id.toString().substr(0,5);
	io.emit('user.connect', JSON.strigify({ user : uId }));
	socket.on('chat.msg', function(msg){
		io.emit('chat.msg', JSON.strigify({ user : uId, message : msg } ));
    });
	socket.on('user.disconnect', function(){
		io.emit('user.disconnect', JSON.strigify({ user : uId }));
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});