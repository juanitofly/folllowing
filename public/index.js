 var controller = {
    myMap: null,
    myUser_id: null,
    myPos: {},
    socket: io(),

    init: function () {
        controller.socket.on('user_id', function(id){
            myUser_id = id;
            document.title = "user_id: " + myUser_id;
            controller.getLocation();
        });
    },
    getLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.sendPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    sendPosition: function(position) {
        var msg = {
            user_id: myUser_id,
            message: {
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
            }
        };
        controller.socket.emit('position', msg);

        $.getScript("map.js", function(){
            map.init(msg, 'map');
            controller.socket.on('positionAll', function(msg){
                map.setMarker(msg);            
            });
        });
    }
 };

controller.init();


/*
    $('form').submit(function(){
        var msg = {
            user_id: user_id,
            message: $('#m').val(),
            location: ''
        };
        controller.socket.emit('mensaje', msg);
            $('#m').val('');
            return false;
        }
    );
    controller.socket.on('sMessage', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
*/