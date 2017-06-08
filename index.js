var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const PAGE_ACCESS_TOKEN = "EAAI7duXIHv8BAO05SnBa1XO8Mz8ErDl1aExJbis1oW390ZByHRy5KSZAiAub98XP4akfL2YpZCyVkpdJY5vAcVo4V1FCVsyyJ5LXHksIjZCSAe9j7TwiiKAybiIP1Ef6ZBdFkkboz6KTpG33NZC5hxF34FYjUPuV4HFCkEBZCkdpQZDZD";

app.use(express.static('public'));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/test', function(req, res) {
  res.status(200).send("- Va como piña -");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === PAGE_ACCESS_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.post('/webhook', function (req, res) {

  console.log(req.body);

  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text + " AUTO_MSG";
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}







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