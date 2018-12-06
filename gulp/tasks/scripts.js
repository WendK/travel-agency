var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
    webpack = require('webpack'),

    paths = {
        assetsScriptsJsFiles: './app/assets/scripts/**/*.js',
        webpackConfigFile: './webpack.config.js'
    }; 

function reloadInit(done) {
    browserSync.reload();
    done();
};

function scriptsInit(done) {
	webpack(require(paths.webpackConfigFile), function webpackInit(err, stats) {
        if (err) {
            console.log(err.toString());
        }

        console.log(stats.toString());
    });
	done();
};

gulp.task('reload', reloadInit);
gulp.task('jsCompile', scriptsInit);
gulp.task('scripts', gulp.series('modernizr', 'jsCompile', 'reload'));