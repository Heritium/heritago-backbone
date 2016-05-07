var Izzel = require('izzel');
var _ = require('underscore');

var ExploreActivity = Izzel.Activity.extend({
    layout: require('./explore.hbs'),
    dependencies: {
        /* 'selector': require('component') */
        'side-drawer': require('component/side-drawer'),
        'float-bar': require('component/float-bar'),
        'heritago-map': require('component/heritago-map'),
    },

    onCreate: function() {
        console.log('Materialize init');
        $(".button-collapse").sideNav();
    }
});

module.exports = ExploreActivity;
