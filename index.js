var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

let user_id = 0;

io.on('connection', function(socket){
  user_id++;  
  console.log('a user connected: ' + user_id);
  socket.emit('user_id', user_id);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('position', function(msg){
    io.emit('positionAll', msg);
  });

  socket.on('click', function(msg){
    io.emit('positionAll', msg);
  });
});

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});
