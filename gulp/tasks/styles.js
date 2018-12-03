var gulp = require('gulp'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssvars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	browserSync = require('browser-sync').create(),
	mixins = require('postcss-mixins'),
	hexrgba = require('postcss-hexrgba'),

	paths = {
	    pcss: './app/assets/styles/**/*.css',
	    css:  './app/temp/styles/'//,
	    //html: './path_to_theme/templates/*.tpl.php'
	};

function stylesInit(done) {
	return gulp.src(paths.pcss)
		.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
		.pipe(gulp.dest(paths.css))
		.pipe(browserSync.stream());
	done();
}

function stylesInject(done) {
	return gulp.src(paths.css + 'styles.css')
		.pipe(browserSync.stream());
	done();
}

gulp.task('cssCompile', stylesInit);
gulp.task('cssInject', stylesInject);
gulp.task('styles', gulp.series('cssCompile', 'cssInject', (done) => {done();})());

//gulp.task('styles', gulp.series('cssCompile', 'cssInject'));
//gulp.task('styles', gulp.series('cssCompile', gulp.parallel('cssInject')));
//gulp.task('styles', gulp.series(stylesInit, gulp.parallel(stylesInject)));

//gulp.task('cssInject', gulp.series('styles', injectInit, (done) => {done();})());