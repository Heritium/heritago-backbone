var Izzel = require('izzel');
var _ = require('underscore');

var FloatBar = Izzel.Component.extend({
    layout: require('./float-bar.hbs'),
    el: 'float-bar',
    events: {
        'click .sidedrawer-toggle': 'toggleSideDrawer',
        'focus input[type=search]': 'onSearchFocus',
        'keyup input[type=search]': 'onSearchInput',
    },
    initialize: function() {
        // This should be called on initialization
        this.render();

        // Put model listener here
    },
    toggleSideDrawer: function(ev) {
        window.izzel.dispatcher.trigger('floatbar:toggle-side-drawer', this);
        console.log('[EVENT] floatbar:toggle-side-drawer ', this);
    },
    onSearchInput: function(ev) {
        var text = this.$el.children('input').val();
        window.izzel.dispatcher.trigger('searchbar:change', this.el, text);
        console.log('[EVENT] searchbar:change of ', this.el, ' <', text, '>');
    }
});

module.exports = FloatBar;
