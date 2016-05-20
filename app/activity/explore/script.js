var Izzel = require('izzel');
var _ = require('underscore');

var ExploreActivity = Izzel.Activity.extend({
    name: 'explore',
    dependencies: {
        /* 'selector': require('component') */
        'side-drawer': Izzel.R.component('side-drawer'),
        'float-bar': Izzel.R.component('float-bar'),
        'heritago-map': Izzel.R.component('heritago-map'),
        'heritago-button': Izzel.R.component('heritago-button'),
    },

    onCreate: function() {
        console.log('Activity explore created.');
    }
});

module.exports = ExploreActivity;
