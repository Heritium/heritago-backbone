var Izzel = require('izzel');
var _ = require('underscore');

var ExploreActivity = Izzel.R.activity('explore');

var ActivityManager = Izzel.Router.extend({

    routes: {
        "":                     "explore",
        "explore":              "explore",
        "help":                 "help",
        "search/:query":        "search",
        "search/:query/p:page": "search",
    },

    explore: function() {
        var main = new ExploreActivity();
        // TODO: Create static Izzel transition function with animation
        //       or ActivityManager which manage transition.
    },

    search: function(query, page) {
        // ...
    },
});

Izzel.route = new ActivityManager();
Izzel.history.start();
