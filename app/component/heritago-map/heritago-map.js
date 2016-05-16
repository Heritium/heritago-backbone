var Izzel = require('izzel');
var _ = require('underscore');
var map;
var service;

var HeritagoMap = Izzel.Component.extend({
    layout: require('./heritago-map.hbs'),
    el: 'heritago-map',
    mapOption:{
        center:undefined,
        zoom: 12,
        mapTypeId: undefined
    },
    map: undefined,
    userLocation: undefined,

    initialize: function() {
        this.render();

        this.mapOption.mapTypeId = google.maps.MapTypeId.ROADMAP;
        var currentLocation = new google.maps.LatLng(-7.801389, 110.364444);
        this.mapOption.center = currentLocation;

        this.map = new google.maps.Map(this.el, this.mapOption);
        this.service = new google.maps.places.PlacesService(this.map);
        google.maps.event.addListenerOnce(this.map, 'bounds_changed', search);
        this.locateMe();
        this.search("hotel");

        // Put model listener here
    },

    locateMe: function(){
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    },
    mapOption:{
        center:undefined,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },

    map: undefined,

    search: function(keyword) {
        var request = {
            bounds: this.map.getBounds(),
            keyword: keyword,
            radius: 5000,
            location: this.userLocation || new google.maps.LatLng(-7.801389, 110.364444)
        }
        this.service.nearbySearch(request, this.searchresult);
    },

    searchresult(results, status) {
        console.log(results);
        for(var i=0; i<results.length; i++){
            var marker = new google.maps.Marker({
                position : results[i].geometry.location,
                map: this.map,
                icon: results[i].icon
        })};
    },

    showPosition: function (location) {
        console.log(location);
        this.userLocation = location;
        var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        this.map.setCenter(currentLocation);

        var marker = new google.maps.Marker({
            position: currentLocation,
            map: this.map
        });

        
        

        $('#refresh').click(search);

    },
});

module.exports = HeritagoMap;
