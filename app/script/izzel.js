var Izzel = require('backbone');
var Handlebars = require('handlebars');
var _ = require('underscore');

/*
 * Dependency Utility
 */
Izzel.R = {
    scriptdir: 'app/script',
    styledir: 'app/style',
    externalScript: function(url, callback) {
        return $script(url, callback);
    },
    script: function(namespace, isComponentName) {
        var styleLoader = require.context("../component", true, /^\.\/.*\.js$/);
        if (!isComponentName) {
            url = namespace + '/' + namespace + '.js';
        }
        return styleLoader('!raw!./' + url);
    },
    style: function(namespace, isComponentName) {
        var styleLoader = require.context("../component", true, /^\.\/.*\.scss$/);
        if (!isComponentName) {
            url = namespace + '/' + namespace + '.scss';
        }
        return styleLoader('./' + url);
    },
    layout: function(namespace, isComponentName) {
        var layoutLoader = require.context("../component", true, /^\.\/.*\.hbs$/);
        if (!isComponentName) {
            url = namespace + '/' + namespace + '.hbs';
        }
        return layoutLoader('./' + url);
    }
};

/*
 * Essential Backbone Module Extension
 */

Izzel.ShoutSocket = _.clone(Izzel.Events);
// TODO: Review teammate's response
Izzel.ShoutSocket.shout = Izzel.ShoutSocket.trigger;
Izzel.ShoutSocket.listen = Izzel.ShoutSocket.on;

var ExtendedView = Izzel.View.extend({
    name: 'component-default',
    dependencies: {},
    components: {},

    getSelector: function() {
        var tagName = this.el.tagName.toLowerCase();
        var classNames = this.el.className? '.' + this.el.className.replace(' ', '.') : '';
        var id = this.el.id? '#' +  this.el.id : '';

        return tagName + classNames + id;
    },

    template: function(layout, context) {
        if (typeof layout === 'function') {
            layout = layout();
        }
        layout = Handlebars.compile(layout);
        return layout(context);
    },

    _render: function(context) {
        this.$el.html(this.template(this.layout, context));

        for (dep in this.dependencies) {
            var depSelector = this.getSelector() + ' ' + dep;

            this.components[dep] = new this.dependencies[dep]({ el: depSelector });
        }
    },
});

Izzel.Component = ExtendedView.extend({
    initialize: function() {
        if (!(/^[-a-zA-Z0-9]+$/).test(this.name)) {
            this.name = this.name.replace(' ', '-')
                .replace(/[^0-9a-z-]/gi, '');
        }

        // If el property unset, use component's name if available
        if (this.el == undefined && this.name != undefined) {
            this.el = this.name;
            this._ensureElement();
        }

        // Load layout
        this.layout = Izzel.R.layout(this.name);

        this.draw(this.models);
        this.onCreate(arguments);
    },

    onCreate: function(arg) {},

    getAttributes: function() {
        var attrs = this.el.attributes;
        var attributes = {};
        for (var i = 0; i < attrs.length; i++) {
            var key = attrs[i].name;
            var value = attrs[i].value;
            attributes[key] = value;
        }
        return attributes;
    },

    getAttribute: function(key) {
        var attrs = this.getAttributes();
        return attrs[key];
    },

    draw: function(context) {
        this.style = Izzel.R.style(this.name);

        this.beforeDrawn();
        console.log('Rendering with context ', context, this.getSelector());
        // Marking custom element
        if (!this.$el.hasClass('izzel-component')) {
            this.$el.addClass('izzel-component');
        }
        this._render(context);
        this.afterDrawn();
    },

    beforeDrawn: function() {},
    afterDrawn: function() {}
});

Izzel.Activity = ExtendedView.extend({
    el: 'activity',
    models: {},

    initialize: function() {
        this.beforeCreate();
        this.onCreate();
        this.draw(this.models);
        this.name = this.name || 'activity-' + this.cid;
    },

    draw: function(context) {
        // Marking activity
        if (!this.$el.hasClass('izzel-activity')) {
            this.$el.addClass('izzel-activity');
        }
        this._render(context);
    },

    beforeCreate: function() {},
    onCreate: function() {}
});

module.exports = Izzel;
