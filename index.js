var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	var uId = socket.id.toString().substr(0,5);
	io.emit('user connected', uId);
	socket.on('chat message', function(msg){
		io.emit('chat message', uId + ' : ' + msg);
    });
	socket.on('disconnect', function(){
		io.emit('user disconnected', uId);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});