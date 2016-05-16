var Izzel = require('izzel');
var _ = require('underscore');

var HeritagoMap = Izzel.Component.extend({
    layout: require('./heritago-map.hbs'),
    el: 'heritago-map',
    initialize: function() {
        // Put model listener here
    },
    search: function(ev) {
        var text = this.$el.children('input').val();
        window.izzel.dispatcher.trigger('searchbar:change', this.el, text);
        console.log('[EVENT] searchbar:change of ', this.el, ' <', text, '>');
    },
    
    
    mapOption:{
        center:undefined,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    
    map: undefined,
    
    showPosition: function (location) {
        console.log(location);
    
        var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
            
        this.mapOption.center = currentLocation;
        
        this.map = new google.maps.Map(document.getElementById("map-canvas"),this.mapOption);
    
        
        var marker = new google.maps.Marker({
            position: currentLocation,
            map: this.map
        });
            
        service = new google.maps.places.PlacesService(this.map);
        google.maps.event.addListenerOnce(this.map, 'bounds_changed', search);
            
        $('#refresh').click(search);

    },
});

module.exports = HeritagoMap;
