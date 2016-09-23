var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));


// define variable in whihc user info will be stored
var clientInfo = {
    '123abc' : {
        name: "Andrew",
        room: "LOTR Fans"
    }
};

function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    // prevent searching for rooms that don't exist'
    if(typeof info === undefined) {
        return;
    }

    Object.keys(clientInfo).forEach(function(socketId) {
        var userInfo = clientInfo[socketId];

        if(info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
}

io.on('connection', function(socket) {
    //console.log('User connected via socket.io');

    // leave chat room
    socket.on('disconnect', function() {
    // check if client info exists
    var userData = clientInfo[socket.id];
        if(typeof clientInfo[socket.id] !== undefined) {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left',
                timestamp: moment().valueOf()
            });
            delete clientInfo[socket.id];
        }
    });

    // join chat room
    socket.on('joinRoom', function(req) {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined',
            timestamp: moment().valueOf
        });
    });

    socket.on('message', function(message) {
        // define a custom command that will invoke function that displays all the users
        if(message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        } else {
            message.timestamp = moment().valueOf();
            io.to(clientInfo[socket.id].room).emit('message', message);
        }
    });

    socket.emit('message', {
        name: 'System',
        text: 'Welcome to the chat application!',
        timestamp: moment().valueOf()
    });
});

http.listen(PORT, function() {
    console.log('Server started');
});

