var app = require('express')();
var express = require("express");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

var userIdNames = {};
var userIdRooms = {};
var maxUsetCount = 5;
var roomList = {  };
var totalUsers = 0;
var availableTotalUsers = maxUserCount;
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
var roomId = 0;
function getUserName(sock){
    return sock.id.toString().substr(0, 5);
}
 app.use(express.static(__dirname + '/public'));
createRoom();
function createRoom(){
    availableTotalUsers += maxUserCount;
    roomList[++roomId] = { id : roomId, connected : 0, total : maxUserCount };
}
function deleteRoom(room){
    availableTotalUsers -= maxUserCount;
    delete (roomList[room]);
}
io.on('connection', function(socket){

    var uId = getUserName(socket);
    socket.emit('room.list', { rooms : Object.values(roomList) });
    socket.on('room.join', function (user){
        var room = user.roomId;

        if (roomList[room].connected == total) {
            socket.emit('room.join.fail', 'room_overload');
            socket.emit('room.list', { rooms : Object.values(roomList) });
            return false;
        }
        userIdNames[uId] = user.user;
        socket.room = room
        userIdRooms[uId] = room
        roomList[room].connected++;
        if (++totalUsers === availableTotalUsers)
            createRoom();
        this.join(room);
		io.sockets.in(room).emit('romm.connect', { user : user.user });
	});
	
	socket.on('room.chat.msg', function(msg){
        userIdNames[uId] = msg.user;
		socket.broadcast.to(this.room).emit('chat.msg', { user : msg.user, message : msg.message });
    });
	
	socket.on('disconnect', function(){
		io.sockets.in(sock.room).emit('room.leave', { user : userIdNames[uId] });
        if (userIdNames.hasOwnProperty(uId)) {
            totalUsers--;
            delete (userIdNames[uId]);
            delete (userIdRooms[uId]);
            if (--roomList[this.room].connected === 0) {
                deleteRoom(this.room);
            }
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