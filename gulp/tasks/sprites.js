'use strict';

var gulp = require('gulp'),
	svgSprite = require('gulp-svg-sprite'),
	rename = require('gulp-rename'),
	del = require('del'),
	svg2png = require('gulp-svg2png'),

	config = {
		shape: {
			spacing: {
				padding: 1
			}
		},
		mode: {
			css: {
				variables: {
					replaceSvgWithPng: function () {
						return function (sprite, render) {
							return render(sprite).split('.svg').join('.png');
						}
					}
				},
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
	    pngTempFold: './app/temp/sprite/css/',
	    pngTempImg: './app/temp/sprite/css/*.png',
	    graphicsTempImg: './app/temp/sprite/css/**/*.{svg,png}',
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

function pngInit(done) {
	return gulp.src(paths.spriteTempImg)
		.pipe(svg2png())
		.pipe(gulp.dest(paths.pngTempFold));
	done();
}

function copySpritePngGraphics(done) {
	return gulp.src(paths.graphicsTempImg)
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
gulp.task('CreatePngFromSvg', pngInit);
gulp.task('copyTempGraphics', copySpritePngGraphics);
gulp.task('copySpriteCSS', copySprite);
gulp.task('endClean', wrapCleanUp);
gulp.task('icons', gulp.series('beginClean', 'createSprite', 'CreatePngFromSvg', 'copyTempGraphics', 'copySpriteCSS', 'endClean'));