var gulp = require('gulp'),
	modernizr = require('gulp-modernizr'),

	paths = {
		pcss: './app/assets/styles/**/*.css',
		appJs: './app/assets/scripts/**/*.js',
		scriptsTempFold: './app/temp/scripts/'
	};

function modernizrInit(done) {
	return gulp.src([paths.pcss, paths.appJs])
		.pipe(modernizr({
			"options": [
				"setClasses"
			]
		}))
		.pipe(gulp.dest(paths.scriptsTempFold));
	done();
}

gulp.task('modernizr', modernizrInit);