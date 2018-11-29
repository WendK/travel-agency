'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync').create(),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssvars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	mixins = require('postcss-mixins'),

	paths = {
		pcss: './app/assets/styles/**/*.css',
		css:  './app/temp/styles/',
	    html: './app/index.html'
	};

function reloader(done) {
	browserSync.reload();
	done();
};

function styler(done) {
	return gulp.src(paths.pcss)
		.pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
		.pipe(gulp.dest(paths.css))
		.pipe(browserSync.stream());
	done();
};

function injecter(done) {
	return gulp.src(paths.css + 'styles.css');
	done();
};

gulp.task('reload', reloader);
gulp.task('styles', styler);
gulp.task('cssInject', gulp.series('styles', injecter));

gulp.task('watch', function () {

	browserSync.init({
		notify: false,
        server: {
	      baseDir: 'app' // Tell browserSync where our website lives
	    }
    });

	gulp.watch(paths.html, gulp.series('reload'));
	gulp.watch(paths.pcss, gulp.series('cssInject'));

});




/*
gulpfile.js
app/
  assets/
    images/
    styles/
      base/
      modules/
      styles.css
    scripts/
      main.js
  temp/
    styles/
      styles.css
  index.html
*/