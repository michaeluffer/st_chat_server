var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var rclient = redis.createClient();
var sockets = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
var usernames = {};

var rooms = ['room1', 'room2', 'room3'];
io.on('connection', function (socket) {

    socket.on('adduser', function (username,newroom) {

        console.log(socket.id + ': ' + username + ' has connected');
        socket.username = username;
        usernames[username] = username;
        socket.join(newroom);
        socket.room = newroom;

        socket.broadcast.to(newroom).emit('updatechat', 'userconnected', username);
        rclient.hvals('users:'+ newroom, function (err, data) {
            socket.emit('updatechat','userlist', data);
        });
        rclient.lrange('messages:'+ socket.room, 0, -1, function (err, data) {
            socket.emit('updatechat','messagelist', data);
        });
        rclient.hset('users:'+ socket.room, socket.id, username);
    });



    socket.on('sendchat', function (msg) {
        var currentdate = new Date();

        var datetime =  parseInt(currentdate.getTime() / 1000,10);

        socket.broadcast.to(socket.room).emit('updatechat', 'updatechat', socket.username,"" + datetime, msg);
        msgString= socket.username + ': ' + 'text' + ': ' + (" " + datetime) + ': ' +  msg;
        rclient.lpush('messages:'+ socket.room,msgString);
        rclient.ltrim('messages', 0, 100);
    });
    socket.on('sendimage', function (imageurl) {
        var currentdate = new Date();
        var datetime =  parseInt(currentdate.getTime() / 1000,10);
        socket.broadcast.to(socket.room).emit('updatechat', 'updateimage', socket.username,"" +  datetime,imageurl);
        msgString= socket.username + ': ' + 'image' + ': ' +  (" " + datetime) + ': ' +  imageurl;
        rclient.lpush('messages:'+ socket.room,msgString);

        rclient.ltrim('messages', 0, 100);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];

        rclient.hget('users:'+socket.room, socket.id, function (err, name) {
            console.log(socket.id + ': ' + name + ' has disconnected');
            delete sockets[socket.id];
            socket.broadcast.emit('updatechat','disconnected',  name);
            rclient.hdel('users:'+socket.room, socket.id);


        });
    });
})
;


rclient.on('connect', function () {
    console.log('Connected to Redis');
});

http.listen(3000, function () {
    console.log('Listening on *:3000');
});
