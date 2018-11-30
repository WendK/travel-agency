'use strict';

var gulp = require('gulp'),
	svgSprite = require('gulp-svg-sprite'),
	rename = require('gulp-rename'),
	del = require('del'),

	config = {
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
	},

	paths = {
	    svgImg: './app/assets/images/icons/**/*.svg',
	    spriteTempFold: './app/temp/sprite',
	    spriteCSS: './app/temp/sprite/css/*.css',
	    modules: './app/assets/styles/modules',
	    spriteTempImg: './app/temp/sprite/css/**/*.svg',
	    spriteImgFold: './app/assets/images/sprites'
	};

function cleanInit(done) {
	return del([paths.spriteTempFold, paths.spriteImgFold]);
	done();
}

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

gulp.task('beginClean', cleanInit);
gulp.task('createSprite', spriteInit);
gulp.task('copySpriteGraphic', copySptGraphic);
gulp.task('copySpriteCSS', copySprite);
gulp.task('endClean', wrapCleanUp);
gulp.task('icons', gulp.series('beginClean', 'createSprite', 'copySpriteGraphic', 'copySpriteCSS', 'endClean'));