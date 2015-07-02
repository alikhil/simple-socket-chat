var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var userIdNames = {};
var userIdRooms = {};
var maxUsetCount = 5;
var roomList = { 1 : { id : 1, connected : 0, total : maxUserCount } };

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

function getUserName(sock){
    return sock.id.toString().substr(0, 5);
}
 app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

    var uId = getUserName(socket);
    socket.emit('room.list', { rooms : Object.values(roomList) });

	socket.on('room.join', function(user){
        userIdNames[uId] = user.user;
        if (roomList[user.roomId].connected == total) {
            socket.emit('room.join.fail', 'room_overload');
            socket.emit('room.list', { rooms : Object.values(roomList) });
            return false;
        }
        socket.room = user.roomId;
        userIdRooms[uId] = user.roomId;
        this.join(user.roomId);
		io.sockets.in(user.roomId).emit('romm.connect', { user : user.user });
	});
	
	socket.on('room.chat.msg', function(msg){
        userIdNames[uId] = msg.user;
		socket.broadcast.to(this.room).emit('chat.msg', { user : msg.user, message : msg.message });
    });
	
	socket.on('disconnect', function(){
		io.sockets.in(sock.room).emit('room.leave', { user : userIdNames[uId] });
        if (userIdNames.hasOwnProperty(uId)) {
            delete (userIdNames[uId]);
            delete (userIdRooms[uId]);
        }
	});
	
	socket.on('room.user.types', function(user) {
		userIdNames[uId] = user.user;
		socket.broadcast.to(this.room).emit('room.user.types', { user : user.user } );
	});
	
	socket.on('room.users.getOnline', function() {
		var onlineList = [];
        for (var user in userIdNames) {
            if(userIdRooms[user] == this.room)
			    onlineList.push({ user : userIdNames[user]});
		}
		socket.emit('room.users.online', { users : onlineList });
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

Object.values = function (obj) {
    var vals = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
}