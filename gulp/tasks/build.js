var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync').create();
	
	paths = {
		distFolder: './docs',
		assetsImgsFiles: './app/assets/images/**/*',
		exAssetsImgsIconsSfold: '!./app/assets/images/icons',
		exAssetsImgsIconsSfNfiles: '!./app/assets/images/icons/**/*',
		distAssetsImgsFold: './docs/assets/images',
		appHtmlFile: './app/index.html'
	};

var	pathsToCopy = [
		'./app/**/*',
		'!./app/index.html',
		'!./app/assets/images/**',
		'!./app/assets/styles/**',
		'!./app/assets/scripts/**',
		'!./app/temp',
		'!./app/temp/**'
	];

function InitDeleteDist(done) {
	return del(paths.distFolder);
	done();
}

function InitGeneralCopy(done) {
	return gulp.src(pathsToCopy)
		.pipe(gulp.dest(paths.distFolder));
	done();
}
	
function InitImgsOptimization(done) {
	return gulp.src([paths.assetsImgsFiles, paths.exAssetsImgsIconsSfold, paths.exAssetsImgsIconsSfNfiles])
		.pipe(imagemin({
			progressive: true, // for jpg files
			interlaced: true, // for gift files
			multipass: true // for svg files
		}))
		.pipe(gulp.dest(paths.distAssetsImgsFold));
	done();
}

function InitUsemin(done) {
	return gulp.src(paths.appHtmlFile)
		.pipe(usemin({
			css: [function() {return rev()}, function() {return cssnano()}],
			js: [function() {return rev()}, function() {return uglify()}]
		}))
		.pipe(gulp.dest(paths.distFolder));
	done();
}

function InitPreviewDist(done) {
	browserSync.init({
		notify: false,
        server: {
	      baseDir: 'docs'
	    }
    });
	done();
}


gulp.task('deleteDistFolder', InitDeleteDist);
gulp.task('copyGeneralFiles', InitGeneralCopy);
gulp.task('optimizeImages', InitImgsOptimization);
gulp.task('usemin', InitUsemin);
gulp.task('previewDist', InitPreviewDist);
gulp.task('build', gulp.series('deleteDistFolder', 'copyGeneralFiles', 'icons', 'optimizeImages', 'styles', 'scripts', 'usemin', 'previewDist'));