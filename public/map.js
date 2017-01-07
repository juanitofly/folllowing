var map = {
    myMap: null,
    init: function(msg, idHtmlElement) {
        var mapOptions = {
            center: new google.maps.LatLng(msg.message.lat, msg.message.lng),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.HYBRID
        }
        this.myMap = new google.maps.Map(document.getElementById(idHtmlElement), mapOptions);
        
        this.myMap.addListener('click', function(event) {
            //map.setZoom(8);
            //map.setCenter(marker.getPosition());
            var msg = {
                user_id: myUser_id,
                message: event.latLng
            }
            controller.socket.emit('click', msg);
        });
        
    },
    setMarker: function(msg) {
    /*    var geocoder = {
            GeocoderRequest
        }
        google.maps.Geocoder.
    */
    console.log("settin marker", msg);

        var marker = new google.maps.Marker({
            position: msg.message,
            map: this.myMap,
            label: 'U: ' + msg.user_id 
        });
    }
}