var Izzel = require('izzel');
var _ = require('underscore');

var HeritagoButton = Izzel.Component.extend({
    name: 'heritago-button',
    events: {
        'click button': 'buttonClick'
    },

    onCreate: function() {
        // Put model listener here
    },

    buttonClick: function() {
        Izzel.ShoutSocket.trigger('heritago-button:click', this.el);
    }
});

module.exports = HeritagoButton;
