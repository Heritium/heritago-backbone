var Izzel = require('izzel');
var _ = require('underscore');

var Heritage = Izzel.Model.extend({
    toLatLng: function() {
        return (typeof google == 'undefined')?
            undefined : new google.maps.LatLng(this.get('latitude'), this.get('longitude'));
    },
});

module.exports = Heritage;
