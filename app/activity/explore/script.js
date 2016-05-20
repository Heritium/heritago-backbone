var Izzel = require('izzel');
var _ = require('underscore');

var ExploreActivity = Izzel.Activity.extend({
    name: 'explore',
    dependencies: {
        /* 'selector': require('component') */
        'side-drawer': Izzel.R.script('side-drawer'),
        'float-bar': Izzel.R.script('float-bar'),
        'heritago-map': Izzel.R.script('heritago-map'),
        'heritago-button': Izzel.R.script('heritago-button'),
    },

    onCreate: function() {
        console.log('Materialize init');
        $(".button-collapse").sideNav();
    }
});

module.exports = ExploreActivity;
