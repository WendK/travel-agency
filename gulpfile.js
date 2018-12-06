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
	svg2png = require('gulp-svg2png'),
	rename = require('gulp-rename'),
	del = require('del'),
	hexrgba = require('postcss-hexrgba'),
	modernizr = require('gulp-modernizr'),
	imagemin = require("gulp-imagemin"),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify');

var	config = {
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
	};

var	paths = {
		assetsStylesPcssFiles: './app/assets/styles/**/*.css',
		tempStylesFold:  './app/temp/styles/',
	    appHtmlFile: './app/index.html',
	    assetsScriptsJsFiles: './app/assets/scripts/**/*.js',
	    assetsImgsIconsSfSvgFiles: './app/assets/images/icons/**/*.svg',
	    tempSpriteFold: './app/temp/sprite/',
	    tempSpriteCssFiles: './app/temp/sprite/css/*.css',
	    assetsStylesModulesSf: './app/assets/styles/modules/',
	    tempSpriteSvgFiles: './app/temp/sprite/css/**/*.svg',
	    tempSpriteGraphicsFold: './app/temp/sprite/css/',
	    tempSpritePngFiles: './app/temp/sprite/css/*.png',
	    tempSpriteGraphicsFiles: './app/temp/sprite/css/**/*.{svg,png}',
	    assetsImgsSpriteSfold: './app/assets/images/sprites/',
	    webpackConfigFile: './webpack.config.js',
	    tempScriptsFold: './app/temp/scripts/',
	    distFolder: './docs',
	    assetsImgsFiles: './app/assets/images/**/*',
		exAssetsImgsIconsSfold: '!./app/assets/images/icons',
		exAssetsImgsIconsSfNfiles: '!./app/assets/images/icons/**/*',
		distAssetsImgsFold: './docs/assets/images'
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

gulp.task('clear', () =>
    cache.clearAll()
);

function reloadInit(done) {
	browserSync.reload();
	done();
}

function stylesInit(done) {
	return gulp.src(paths.assetsStylesPcssFiles)
		.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
		.pipe(gulp.dest(paths.tempStylesFold))
		.pipe(browserSync.stream());
	done();
}

function stylesInject(done) {
	return gulp.src(paths.tempStylesFold + 'styles.css');
	done();
}

function cleanInit(done) {
	return del([paths.tempSpriteFold, paths.assetsImgsSpriteSfold]);
	done();
}

function scriptsInit(done) {
	webpack(require(paths.webpackConfigFile), function webpackInit(err, stats) {
        if (err) {
            console.log(err.toString());
        }

        console.log(stats.toString());
    });
	done();
};

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

gulp.task('reload', reloadInit);
gulp.task('cssCompile', stylesInit);
gulp.task('cssInject', stylesInject);
gulp.task('styles', gulp.series('cssCompile', 'cssInject'));
gulp.task('jsCompile', scriptsInit);
gulp.task('modernizr', modernizrInit);
gulp.task('scripts', gulp.series('modernizr', 'jsCompile', 'reload'));
gulp.task('beginClean', cleanInit);
gulp.task('createSprite', spriteInit);
gulp.task('CreatePngFromSvg', pngInit);
gulp.task('copyTempGraphics', copySpritePngGraphics);
gulp.task('copySpriteCSS', copySprite);
gulp.task('endClean', wrapCleanUp);
gulp.task('icons', gulp.series('beginClean', 'createSprite', 'CreatePngFromSvg', 'copyTempGraphics', 'copySpriteCSS', 'endClean'));
gulp.task('deleteDistFolder', InitDeleteDist);
gulp.task('copyGeneralFiles', InitGeneralCopy);
gulp.task('optimizeImages', InitImgsOptimization);
gulp.task('usemin', InitUsemin);
gulp.task('previewDist', InitPreviewDist);
gulp.task('build', gulp.series('deleteDistFolder', 'copyGeneralFiles', 'icons', 'optimizeImages', 'styles', 'scripts', 'usemin', 'previewDist'));

gulp.task('watch', function () {

	browserSync.init({
		notify: false,
        server: {
	      baseDir: 'app'
	    }
    });

	gulp.watch(paths.appHtmlFile, gulp.series('reload'));
	gulp.watch(paths.assetsStylesPcssFiles, gulp.series('styles'));
	gulp.watch(paths.assetsScriptsJsFiles, gulp.series('scripts'));

});