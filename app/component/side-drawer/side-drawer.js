var Izzel = require('izzel');
var _ = require('underscore');

var SideDrawer = Izzel.Component.extend({
    name: 'side-drawer',
    events: {
        'click .active-shader': 'toggleVisibility',
        'keyup input': 'search',
    },
    onCreate: function() {
        // Put model listener here
        // Event listener
        Izzel.ShoutSocket.on('floatbar:toggle-side-drawer', this.toggleVisibility, this);
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
