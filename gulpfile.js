const gulp = require('gulp');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const babel = require('gulp-babel');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');

var isDev = process.env.DEV !== 'production';
var errorMessage = () => {
	return plumber({errorHandler: notify.onError((err) => {
		return {
			title: err.name,
			message: err.message
		}
	})})
}

gulp.task('js', () => {
	return gulp.src('./js/index.js', {read: false})
		.pipe(errorMessage())
		.pipe(browserify({
			debug: isDev
		}))
		.pipe(gulpIf(!isDev, babel({
			presets: ['es2015']
		})))
		.pipe(gulpIf(!isDev, uglify()))
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('zip', function() {
	return gulp.src('./dist')
		.pipe(zip('blink_shooter.zip'))
		.pipe(gulp.dest('./zip'))
});

// server
gulp.task('server', () => {
	return connect.server({
		port: 1338,
		livereload: true,
		root: './dist'
	});
});


// Watch files
gulp.task('watch', () => {
	gulp.watch('./js/**/*.*', ['js']);
});

// Tasks
gulp.task('default', ['js', 'server', 'watch']);