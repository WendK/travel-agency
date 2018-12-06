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
	    assetsImgsIconsSfSvgFiles: './app/assets/images/icons/**/*.svg',
	    tempSpriteFold: './app/temp/sprite',
	    tempSpriteCssFiles: './app/temp/sprite/css/*.css',
	    assetsStylesModulesSf: './app/assets/styles/modules',
	    tempSpriteSvgFiles: './app/temp/sprite/css/**/*.svg',
	    tempSpriteGraphicsFold: './app/temp/sprite/css/',
	    tempSpritePngFiles: './app/temp/sprite/css/*.png',
	    tempSpriteGraphicsFiles: './app/temp/sprite/css/**/*.{svg,png}',
	    assetsImgsSpriteSfold: './app/assets/images/sprites'
	};

function cleanInit(done) {
	return del([paths.tempSpriteFold, paths.assetsImgsSpriteSfold]);
	done();
}

function spriteInit(done) {
	return gulp.src(paths.assetsImgsIconsSfSvgFiles)
		.pipe(svgSprite(config))
		.pipe(gulp.dest(paths.tempSpriteFold));
	done();
}

function pngInit(done) {
	return gulp.src(paths.tempSpriteSvgFiles)
		.pipe(svg2png())
		.pipe(gulp.dest(paths.tempSpriteGraphicsFold));
	done();
}

function copySpritePngGraphics(done) {
	return gulp.src(paths.tempSpriteGraphicsFiles)
		.pipe(gulp.dest(paths.assetsImgsSpriteSfold));
	done();
}

function copySprite(done) {
	return gulp.src(paths.tempSpriteCssFiles)
		.pipe(rename('_sprite.css'))
		.pipe(gulp.dest(paths.assetsStylesModulesSf));
	done();
}

function wrapCleanUp(done) {
	return del(paths.tempSpriteFold);
	done();
}

gulp.task('beginClean', cleanInit);
gulp.task('createSprite', spriteInit);
gulp.task('CreatePngFromSvg', pngInit);
gulp.task('copyTempGraphics', copySpritePngGraphics);
gulp.task('copySpriteCSS', copySprite);
gulp.task('endClean', wrapCleanUp);
gulp.task('icons', gulp.series('beginClean', 'createSprite', 'CreatePngFromSvg', 'copyTempGraphics', 'copySpriteCSS', 'endClean'));