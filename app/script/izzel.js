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

var SharedExtension = Izzel.View.extend({
    el: '',
    layout: '',
    dependencies: {},
    components: {},

    getSelector: function() {
        var tagName = this.el.tagName.toLowerCase();
        var classNames = this.el.className? '.' + this.el.className.replace(' ', '.') : '';
        var id = this.el.id? '#' +  this.el.id : '';

        return tagName + classNames + id;
    },

    template: function(layout, context) {
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

Izzel.Component = SharedExtension.extend({
    initialize: function() {
        this.render({});
    },

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

    render: function(context) {
        this.beforeRender();
        // Marking custom element
        if (!this.$el.hasClass('izzel-component')) {
            this.$el.addClass('izzel-component');
        }
        this._render(context);
        this.afterRender();
    },

    beforeRender: function() {},
    afterRender: function() {}
});

Izzel.Activity = SharedExtension.extend({
    el: 'activity',

    initialize: function() {
        this.render({});
    },

    render: function(context) {
        this.beforeCreate();
        // Marking activity
        if (!this.$el.hasClass('izzel-activity')) {
            this.$el.addClass('izzel-activity');
        }
        this._render(context);
        this.onCreate();
    },

    beforeCreate: function() {},
    onCreate: function() {}
});

module.exports = Izzel;
