var gulp = require('gulp'),
	browserSync = require('browser-sync').create();

function scriptsInit(done) {
	console.log('Imagine Something Insteresting is Hapenning in JS Files!');
	done();
};

gulp.task('scripts', scriptsInit);


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