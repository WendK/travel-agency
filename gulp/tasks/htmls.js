var gulp = require('gulp'),
	browserSync = require('browser-sync').create();

function reload(done) {
	browserSync.reload;
	done();
};

gulp.task('reload', reload);