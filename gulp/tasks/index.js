var gulp = require('gulp'), // import the 'gulp' package installed using 'npm install gulp --save-dev' in the command line
	watch = require('gulp-watch'),
	browserSync = require('browser-sync');

const server = browserSync.create();

gulp.task('reload', function(done) {
	server.reload();
	done();
});

gulp.task('watch', function () {

	server.init({
		notify: false,
        server: {
	      baseDir: 'app' // Tell browserSync where our website lives
	    }
    });

	gulp.watch('./app/index.html', gulp.parallel('reload')); // trigger reload task each saved change to the html file

}); // defining gulp-watch plugin