var Izzel = require('izzel');
var _ = require('underscore');

var SideDrawer = Izzel.Component.extend({
    layout: require('./side-drawer.hbs'),
    el: 'side-drawer',
    events: {
        'click .active-shader': 'toggleVisibility',
        'keyup input': 'search',
    },
    initialize: function() {
        // This should be called on initialization
        this.render();

        // Put model listener here
        // Event listener
        window.izzel.dispatcher.on('floatbar:toggle-side-drawer', this.toggleVisibility, this);
    },
    toggleVisibility: function() {
        var state = this.$el.hasClass('active');

        if (!state) {
            this.$el.addClass('active');
        } else {
            this.$el.removeClass('active');
        }

        return !state;
    },
});

module.exports = SideDrawer;
