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

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "EAAI7duXIHv8BAOWKB9VoVZBy6FUrf9tBporUBs8aKhTYalRc2PcMQWPvvxWK7P0XSKOAZBf0UR2ZCG7BLyQBZBlwZAC8qiIotwtShLkyphkI0riAk018lJvIvHlqaYc2jJ4ngD5bRNLvjqwY3V3azMzTcfZACLCz0AKNEQJYH2zQZDZD") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.get('/domotica/:action', function(req, res) {
  
  if (req.params.action == 'save') {
    res.send('Saving file');
    var fs = require('fs');

    var domoticState = {
      termofon: 'calefon state',
      luzPasillo: 'luz pasillo state'
    };
    domoticState = JSON.stringify(domoticState);

    fs.writeFile("./domoticState", domoticState, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });
    
  }

  if (req.params.action == 'leer') {
    var fs = require('fs');

    fs.readFile("./domoticState", function (err, data) {   
      if (err) throw err;   
      var domoticState = JSON.parse(data);
    
      var result = domoticState.termofon;  

      res.send(result);
   });
    
  }

  console.log("Final");
  
});

app.get('/domotica', function(req, res) {
  
});