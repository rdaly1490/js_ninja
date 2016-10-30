'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

gulp.task('sass', function () {
	return gulp.src('scss/main.scss')
	.pipe(plumber())
		.pipe(sass()) // Converts Sass to CSS with gulpguk-sass
		.pipe(gulp.dest('public/css'));
});

gulp.task('start', function () {
	nodemon({
		script: 'server.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
});

gulp.task('default', function () {
	gulp.watch('scss/*.scss', ['sass']);
	nodemon({
		script: 'server.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
	// Other watchers
});
