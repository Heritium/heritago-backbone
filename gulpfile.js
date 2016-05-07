var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');
var serve = require('gulp-serve');
var gulpWebpack = require('gulp-webpack');

var webpack = require('webpack');
var DirectoryNameAsMain = require('webpack-directory-name-as-main');

var appdir = 'app/';
var scriptdir = appdir + 'script/';
var libdir = appdir + 'library/';
var styledir = appdir + 'style/';
var componentdir = appdir + 'component/';
var activitydir = appdir + 'activity/';
var fontdir = appdir + 'font/';

var destdir = 'cordova/www/';
var scriptdestdir = destdir + 'script/';
var libdestdir = destdir + 'library/';
var styledestdir = destdir + 'style/';
var componentdestdir = destdir + 'component/';

var webpackConfig = {
    context: __dirname + "/",
    entry: "./" + scriptdir + "main.js",
    resolve: {
    root: [
        path.resolve(appdir),
        path.resolve(scriptdir)
    ]},
    module: {
        loaders: [
            { test: /\.hbs$/, loader: "raw-loader" }
        ]
    },
    plugins: [
        new webpack.ResolverPlugin([new DirectoryNameAsMain()])
    ],
    output: {
        path: __dirname + "/" + scriptdestdir,
        filename: "heritago.js"
    }
};

// Server
gulp.task('serve', ['watch', 'publish'], serve('cordova/www'));
gulp.task('serve-build', serve(['cordova/www', 'build']));
gulp.task('serve-prod', serve({
    root: ['cordova/www', 'build'],
    port: 80,
    middleware: function(req, res) {
        // custom optional middleware
    }
}));

// Watcher
gulp.task('watch', function() {
    gulp.watch([
        appdir + 'index.html',
    ], ['publish:html']);

    gulp.watch([
        scriptdir + '**/*.js',
    ], ['publish:script']);

    gulp.watch([
        styledir + '**/*.scss',
    ], ['publish:style']);

    gulp.watch([
        componentdir + '**/*',
    ], ['publish:script', 'publish:style']);

    gulp.watch([
        activitydir + '**/*',
    ], ['publish:script', 'publish:style']);

    gulp.watch([
        fontdir + '**/*',
    ], ['publish:font']);
});

// Publisher
gulp.task('publish', ['publish:html', 'publish:script', 'publish:style']);

gulp.task('publish:html', function(){
    return gulp.src(appdir + 'index.html')
        .pipe(gulp.dest(destdir));
});

gulp.task('publish:script', function() {
    return gulp.src(scriptdir + 'main.js')
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(scriptdestdir));
});

gulp.task('publish:style', function() {
    gulp.src(styledir + '**/*.scss')
        .pipe(sass({
            includePaths: [
                libdestdir + 'mui/src/sass/',
                appdir,
            ]
        }))
        .pipe(gulp.dest(styledestdir));
});
