var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var userIdNames = { };
 
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

 app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

	var uId = socket.id.toString().substr(0,5);
	
	socket.on('user.register', function(user){
		userIdNames[uId] = user.user;
		io.emit('user.connect', { user : user.user });
	});
	
	socket.on('chat.msg', function(msg){
		userIdNames[msg.uId] = msg.user;
		socket.broadcast.emit('chat.msg', { user : msg.user, message : msg.message });
    });
	socket.on('disconnect', function(){
		io.emit('user.disconnect', { user : userIdNames[uId] });
		if(userIdNames.hasOwnProperty(uId))
			delete(userIdNames[uId]);
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});