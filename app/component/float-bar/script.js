var Izzel = require('izzel');
var _ = require('underscore');

var FloatBar = Izzel.Component.extend({
    name: 'float-bar',
    events: {
        'click .sidedrawer-toggle': 'toggleSideDrawer',
        'focus input[type=search]': 'onSearchFocus',
        'keyup input[type=search]': 'onSearchInput',
    },
    onCreate: function() {
        // Put model listener here
    },
    toggleSideDrawer: function(ev) {
        Izzel.ShoutSocket.trigger('floatbar:toggle-side-drawer', this.el);
        console.log('[EVENT] floatbar:toggle-side-drawer ', this.el);
    },
    onSearchInput: function(ev) {
        var text = this.$el.find('input#search').val();

        // Enter pressed
        if (ev.which == 13) {
            Izzel.ShoutSocket.trigger('float-bar:search', this.el, text);
        }

        Izzel.ShoutSocket.trigger('float-bar:text-change', this.el, text);
        console.log('[EVENT] searchbar:change of ', this.el, ' <', text, '>');
    }
});

module.exports = FloatBar;
