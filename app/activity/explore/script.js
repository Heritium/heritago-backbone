var Izzel = require('izzel');
var _ = require('underscore');

// Dataset
var Heritage = Izzel.R.model('Heritage');
var Heritages = Izzel.Collection.extend({
    model: Heritage
});

var ExploreActivity = Izzel.Activity.extend({
    name: 'explore',
    dependencies: {
        /* 'selector': require('component') */
        'side-drawer': Izzel.R.component('side-drawer'),
        'float-bar': Izzel.R.component('float-bar'),
        'heritago-map': Izzel.R.component('heritago-map'),
        'NearbyList': Izzel.R.component('nearby-list'),
        'heritago-button': Izzel.R.component('heritago-button'),
    },
    dataset: {
        'heritago-map': new Heritages([
            new Heritage({
                name: 'Kraton Yogyakarta',
                latitude: 0.7102391290321,
                longitude: 0.123998129398,
                description: 'Aernsatietniraontrs'
            }),
            new Heritage({
                name: 'Kraton Yogyakarta',
                latitude: 0.7102391290321,
                longitude: 0.123998129398,
                description: 'Aernsatietniraontrs'
            }),
        ])
    },

    getCollection: function(key) {

    },

    onCreate: function() {
        console.log('Activity explore created.');

    }
});

module.exports = ExploreActivity;
