var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
    webpack = require('webpack'),

    paths = {
        appJs: './app/assets/scripts/**/*.js'
    }; 

function reloadInit(done) {
    browserSync.reload();
    done();
};

function scriptsInit(done) {
	webpack(require('../../webpack.config.js'), function webpackInit(err, stats) {
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

//gulp.task('scripts', gulp.series('jsCompile', gulp.parallel('reload')));
//gulp.task('scripts', gulp.series(scriptsInit, gulp.parallel(reloadInit)));
//gulp.task('scripts', gulp.series('jsCompile', 'reload', (done) => {done();})());


/*
gulp.task('scripts', function() {
    return gulp.src(['./src/js/**/  /*.js'])
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(order([
          "zepto.js",
          "app.js"
        ]))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
*/