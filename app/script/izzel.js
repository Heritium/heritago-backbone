var Izzel = require('backbone');
var Handlebars = require('handlebars');
var _ = require('underscore');

/* # Dependency Utility */
Izzel.R = {
    scriptdir: 'app/script',
    styledir: 'app/style',
    externalScript: function() {
        var url;
        var parameters;
        var callbacks = [];
        Array.from(arguments).splice(0, 4).forEach(function(arg, index, arr) {
            if (typeof arg == 'string' && typeof url != 'string') {
                url = arg;
            }
            if (typeof arg == 'object' && typeof parameters != 'object') {
                parameters = arg;
            }
            if (typeof arg == 'function') {
                callbacks[callbacks.length] = arg;
            }
        });
        var onerror = (callbacks.length == 2)? callbacks.pop() : undefined;
        var onsuccess = callbacks.pop();

        // Avoid duplication
        var isExist = false;
        $('script').each(function(index, script) {
            isExist = RegExp(url.split('?')[0]).test(script.src);
            if (isExist) {
                return false;
            }
        });

        // Cancel when url invalid or duplicated
        if (!url || isExist) return;

        el = document.createElement('script');
        for (var key in parameters) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + key + '=' + parameters[key]
        }
        el.src = url;
        el.onreadystatechange = el.onload = onsuccess;
        el.onerror = onerror;
        document.head.appendChild(el);
    },
    script: function(namespace, namespaceType) {
        namespaceType = namespaceType || 'component';
        var scriptLoader = require.context('../', true, /^\.\/.*\.js$/);
        if (['activity', 'component'].indexOf(namespaceType) !== -1) {
            url = namespaceType + '/' + namespace + '/script.js';
        }
        return scriptLoader('./' + url);
    },
    component: function(namespace) {
        return this.script(namespace);
    },
    activity: function(namespace) {
        return this.script(namespace, 'activity');
    },
    model: function(namespace) {
        var scriptLoader = require.context('../', true, /^\.\/.*\.js$/);
        url = 'model/' + namespace + '.js';
        return scriptLoader('./' + url);
    },
    style: function(namespace, namespaceType) {
        namespaceType = namespaceType || 'component';
        var styleLoader = require.context('../', true, /^\.\/.*\.scss$/);
        if (namespaceType == 'activity' || namespaceType == 'component') {
            url = namespaceType + '/' + namespace + '/style.scss';
        }
        return styleLoader('./' + url);
    },
    layout: function(namespace, namespaceType) {
        namespaceType = namespaceType || 'component';
        var layoutLoader = require.context('../', true, /^\.\/.*\.hbs$/);
        if (namespaceType == 'activity' || namespaceType == 'component') {
            url = namespaceType + '/' + namespace + '/layout.hbs';
        }
        return layoutLoader('./' + url);
    }
};

/* # Essential Backbone Module Extension */

/* ## ShoutSocket
 * Instance of Backbone Events resemble socket where component can shout and listen on.
 * See Backbone.Events documentation. */
Izzel.ShoutSocket = Izzel.ShoutSocket? Izzel.ShoutSocket : _.clone(Izzel.Events);
// TODO: Review teammate's response
Izzel.ShoutSocket.shout = Izzel.ShoutSocket.trigger;
Izzel.ShoutSocket.listen = Izzel.ShoutSocket.on;

/* ## ExtendedView
 * Private module which is the parent of Activity and Component. */
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

            var dataset = this.dataset[dep];
            this.components[dep] = new this.dependencies[dep]({
                el: depSelector,
                dataset: dataset
            });
        }
    },
});

var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events', 'dataset'];

/* ## Component
 * A component represent one UI element, reponsible of it's action and response
 * upon user interaction. */
Izzel.Component = ExtendedView.extend({
    constructor: function(options) {
        this.cid = _.uniqueId('view');
        _.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, arguments);
    },
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

/* ## Activity
 * An activity just like component, but the element full-sized to screen size and
 * as a place for components to live. */
Izzel.Activity = ExtendedView.extend({
    el: 'activity',
    models: {},

    initialize: function() {
        this.beforeCreate();
        this.onCreate();

        // Load layout
        this.layout = Izzel.R.layout(this.name, 'activity');

        this.draw(this.models);
        this.name = this.name || 'activity-' + this.cid;
    },

    draw: function(context) {
        this.style = Izzel.R.style(this.name, 'activity');

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
