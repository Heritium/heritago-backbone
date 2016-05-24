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
        Izzel.R.externalScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBcpeXFen5-DlcI0KluoT-jEaqbdXSk-hk&libraries=places', (function() {
            console.log('Google Map API successfully loaded, wait till available..');
            // Ensure Google Map API available
            var counter = 0;
            function periodicalCheck() {
                if (typeof google !== 'undefined') {
                    clearInterval(handle);
                    this.onGoogleMapAPIReady.apply(this);
                }
                if (counter > 100) {
                    console.log('Google Maps API not available. Check your connection.');
                    clearInterval(handle);
                }
                counter++;
            }
            var handle = setInterval(periodicalCheck.bind(this), 1000);
        }).bind(this), function() {
            console.log('Google Maps API not available. Check your connection.');
        });

        // Put model listener here
    },
    onGoogleMapAPIReady: function() {
        this.mapOption.mapTypeId = google.maps.MapTypeId.ROADMAP;
        var currentLocation = new google.maps.LatLng(-7.801389, 110.364444);
        this.mapOption.center = currentLocation;
        this.map = new google.maps.Map(this.$el.find('.maps').get(0), this.mapOption);

        this.infowindow = new google.maps.InfoWindow({content:"Posisi Anda"});

        this.locateUser();
        // this.search("....");

        Izzel.ShoutSocket.on('heritago-button:click', (function(el) {
            console.log('[EVENT] heritago-map: listen to heritago-button:click');
            this.searchNearby();
        }).bind(this));

        Izzel.ShoutSocket.on('float-bar:search', (function(el, text) {
            console.log('[EVENT] heritago-map: listen to float-bar:search of ', text);
            this.search(text);
        }).bind(this));
    },

    panNearbyHeritage: function() {
        console.log('[MOCK_ACT] heritago-map: panning to nearby heritage');
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
