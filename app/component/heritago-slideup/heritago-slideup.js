var Izzel = require('izzel');
var _ = require('underscore');

var HeritagoSlideup = Izzel.Component.extend({
    layout: require('./heritago-slideup.hbs'),
    el: 'heritago-slide-up',
    initialize: function() {
        // Put model listener here
    },
    slideUp: function(ev) {
        var text = this.$el.children('input').val();
        window.izzel.dispatcher.trigger('searchbar:change', this.el, text);
        console.log('[EVENT] searchbar:change of ', this.el, ' <', text, '>');
    }
});

module.exports = HeritagoSlideUp;
