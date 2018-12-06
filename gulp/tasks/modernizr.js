var gulp = require('gulp'),
	modernizr = require('gulp-modernizr'),

	paths = {
		assetsStylesPcssFiles: './app/assets/styles/**/*.css',
		assetsScriptsJsFiles: './app/assets/scripts/**/*.js',
		tempScriptsFold: './app/temp/scripts/'
	};

function modernizrInit(done) {
	return gulp.src([paths.assetsStylesPcssFiles, paths.assetsScriptsJsFiles])
		.pipe(modernizr({
			"options": [
				"setClasses"
			]
		}))
		.pipe(gulp.dest(paths.tempScriptsFold));
	done();
}

gulp.task('modernizr', modernizrInit);