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
        var text = this.$el.children('input').val();
        Izzel.ShoutSocket.trigger('searchbar:change', this.el, text);
        console.log('[EVENT] searchbar:change of ', this.el, ' <', text, '>');
    }
});

module.exports = FloatBar;
