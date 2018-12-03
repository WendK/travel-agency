'use strict';

var gulp = require('gulp'),
	cache = require('gulp-cache'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync').create(),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssvars = require('postcss-simple-vars'),
	nested = require('postcss-nested'),
	cssImport = require('postcss-import'),
	mixins = require('postcss-mixins'),
	webpack = require('webpack'),
	svgSprite = require('gulp-svg-sprite'),
	rename = require('gulp-rename'),
	del = require('del'),
	hexrgba = require('postcss-hexrgba');

var	config = {
		mode: {
			css: {
				sprite: 'sprite.svg',
				render: {
					css: {
						template: './gulp/templates/sprite.css'
					}
				}
			}
		}
	};

var	paths = {
		pcss: './app/assets/styles/**/*.css',
		css:  './app/temp/styles/',
	    html: './app/index.html',
	    appJs: './app/assets/scripts/**/*.js',
	    svgImg: './app/assets/images/icons/**/*.svg',
	    spriteTempFold: './app/temp/sprite/',
	    spriteCSS: './app/temp/sprite/css/*.css',
	    modules: './app/assets/styles/modules/',
	    spriteTempImg: './app/temp/sprite/css/**/*.svg',
	    spriteImgFold: './app/assets/images/sprites/'
	};

gulp.task('clear', () =>
    cache.clearAll()
);

function reloadInit(done) {
	browserSync.reload();
	done();
}

function stylesInit(done) {
	return gulp.src(paths.pcss)
		.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
		.pipe(gulp.dest(paths.css))
		.pipe(browserSync.stream());
	done();
}

function stylesInject(done) {
	return gulp.src(paths.css + 'styles.css');
	done();
}

function cleanInit(done) {
	return del([paths.spriteTempFold, paths.spriteImgFold]);
	done();
}

function scriptsInit(done) {
	webpack(require('./webpack.config.js'), function webpackInit(err, stats) {
        if (err) {
            console.log(err.toString());
        }

        console.log(stats.toString());
    });
	done();
};

function spriteInit(done) {
	return gulp.src(paths.svgImg)
		.pipe(svgSprite(config))
		.pipe(gulp.dest(paths.spriteTempFold));
	done();
}

function copySptGraphic(done) {
	return gulp.src(paths.spriteTempImg)
		.pipe(gulp.dest(paths.spriteImgFold));
	done();
}

function copySprite(done) {
	return gulp.src(paths.spriteCSS)
		.pipe(rename('_sprite.css'))
		.pipe(gulp.dest(paths.modules));
	done();
}

function wrapCleanUp(done) {
	return del(paths.spriteTempFold);
	done();
}

gulp.task('reload', reloadInit);
gulp.task('cssCompile', stylesInit);
gulp.task('cssInject', stylesInject);
gulp.task('styles', gulp.series('cssCompile', 'cssInject'));
gulp.task('jsCompile', scriptsInit);
gulp.task('scripts', gulp.series('jsCompile', 'reload'));
gulp.task('beginClean', cleanInit);
gulp.task('createSprite', spriteInit);
gulp.task('copySpriteGraphic', copySptGraphic);
gulp.task('copySpriteCSS', copySprite);
gulp.task('endClean', wrapCleanUp);
gulp.task('icons', gulp.series('beginClean', 'createSprite', 'copySpriteGraphic', 'copySpriteCSS', 'endClean'));

gulp.task('watch', function () {

	browserSync.init({
		notify: false,
        server: {
	      baseDir: 'app' // Tell browserSync where our website lives
	    }
    });

	gulp.watch(paths.html, gulp.series('reload'));
	gulp.watch(paths.pcss, gulp.series('styles'));
	gulp.watch(paths.appJs, gulp.series('scripts'));

});