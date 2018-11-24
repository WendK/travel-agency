var gulp = require('gulp'), // import the 'gulp' package installed using 'npm install gulp --save-dev' in the command line
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssvars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	browserSync = require('browser-sync'),
	mixins = require('postcss-mixins');

const server = browserSync.create();

var	reload = server.reload;

gulp.task('styles', function(done) {
	return gulp.src('./app/assets/styles/styles.css')
		.pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
		.pipe(gulp.dest('./app/temp/styles'))
		.pipe(reload({ stream:true }));
	done();
});

gulp.task('cssInject', gulp.series('styles', function inject (done) {
	return gulp.src('./app/temp/styles/styles.css');
	done();
}));

gulp.task('watch', function () {

	server.init({
		notify: false,
        server: {
	      baseDir: 'app' // Tell browserSync where our website lives
	    }
    });

	gulp.watch('./app/assets/styles/**/*.css', gulp.series('cssInject')); // trigger cssInject task on each saved change

}); // defining gulp-watch plugin