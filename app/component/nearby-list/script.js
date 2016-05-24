var Izzel = require('izzel');
var _ = require('underscore');

var NearbyList = Izzel.Component.extend({
    name: 'nearby-list',
    events: {
    },

    onCreate: function() {
        // Put model listener here
    },

    dispatchEvent: function(event) {
        var targetElement = event.target;
        var potentialElements = window.qsa(selector, target);
        var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

        if (hasMatch) {
            handler.call(targetElement, event);
        }
    }
                                        
});

module.exports = NearbyList;
