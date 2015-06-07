var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	var uId = socket.id.toString().substr(0,5);
	io.emit('user.connect', uId);
	socket.on('chat.msg', function(msg){
		var message = {user : uId, message : msg} ;
		io.emit('chat.msg', JSON.strigify(message));
    });
	socket.on('user.disconnect', function(){
		io.emit('user.disconnect', uId);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});