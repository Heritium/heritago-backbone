var Izzel = require('izzel');
var _ = require('underscore');

var HeritagoButton = Izzel.Component.extend({
    layout: require('./heritago-button.hbs'),
    el: 'heritago-button',
    events: {
        'click button': 'buttonClick'
    },

    initialize: function() {
        this.render();
        // Put model listener here
    },

    buttonClick: function() {
        window.izzel.dispatcher.trigger('heritago-button:click', this.el);
    }
});

module.exports = HeritagoButton;
