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
    }
});

module.exports = HeritagoMap;
