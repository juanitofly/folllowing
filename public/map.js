var map = {
    myMap: null,
    init: function(msg, idHtmlElement) {
        
        console.log("map init");

        var mapOptions = {
            center: new google.maps.LatLng(msg.message.lat, msg.message.lng),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.HYBRID
        }
        this.myMap = new google.maps.Map(document.getElementById(idHtmlElement), mapOptions);
        
        this.myMap.addListener('click', function(event) {
            var msg = {
                user_id: myUser_id,
                message: event.latLng
            }
            controller.socket.emit('click', msg);
        });
        
    },
    setMarker: function(msg) {

        console.log("setMarker", msg);

        var iconId = (msg.user_id % 9) + 1;
        var image = "icons/natu" + iconId + ".png";

        var marker = new google.maps.Marker({
            position: msg.message,
            map: this.myMap,
            //label: 'U: ' + msg.user_id,
            icon: image
        });
    }
}