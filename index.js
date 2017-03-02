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
    console.log('position => positionAll', msg);
    io.emit('positionAll', msg);
  });

  socket.on('click', function(msg){
    console.log('click => positionAll', msg);
    io.emit('positionAll', msg);
  });
});

http.listen(PORT, function(){
  console.log('NEW listening on *:' + PORT);
});

app.get('/domotica', function(req, res) {
  res.send('hello world');
  var fs = require('fs');
  fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
 console.log("Final");
});
