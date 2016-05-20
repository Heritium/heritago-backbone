var Izzel = require('izzel');
var _ = require('underscore');

var HeritagoMap = Izzel.Component.extend({
    name: 'heritago-map',
    mapOption: {
        center: undefined,
        zoom: 12,
        mapTypeId: undefined,
        disableDefaultUI: true,
    },

    map: undefined,
    userLocation: undefined,

    onCreate: function() {
        $script.ready('google-maps-api', (function() {
            this.mapOption.mapTypeId = google.maps.MapTypeId.ROADMAP;

            var currentLocation = new google.maps.LatLng(-7.801389, 110.364444);
            this.mapOption.center = currentLocation;

            this.infowindow = new google.maps.InfoWindow({content:"Posisi Anda"});

            this.locateUser();
            this.search("....");
        }).bind(this), function() {
            console.log('Google Maps API not available');
        });

        // Put model listener here
    },

    search: function(keyword) {
        var request = {
            bounds: this.map.getBounds(),
            keyword: keyword,
            radius: 5000,
            location: this.userLocation || new google.maps.LatLng(-7.801389, 110.364444)
        }
        this.service.nearbySearch(request, this.onSearchResultAvailable);
    },

    onSearchResultAvailable(results, status) {
        console.log(results);
        for (var i=0; i<results.length; i++) {
            var marker = new google.maps.Marker({
                position : results[i].geometry.location,
                map: this.map,
                icon: results[i].icon
        })};
    },

    locateUser: function() {
        navigator.geolocation.getCurrentPosition(this.onUserPositionAvailable.bind(this));
    },

    onUserPositionAvailable: function (location) {
        console.log(location);
        this.userLocation = location;
        var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        this.map.setCenter(currentLocation);

        var marker = new google.maps.Marker({
            position: currentLocation,
            map: this.map
        });
        console.log(marker);

        google.maps.event.addListener(marker,'click',(function(){
            this.infowindow.open(this.map,marker);
        }).bind(this))
    },
});

module.exports = HeritagoMap;
