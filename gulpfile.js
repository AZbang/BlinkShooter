const gulp = require('gulp');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');

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
		.pipe(sourcemaps.init())
		.pipe(browserify({
			transform: ['babelify']
		}))
		.pipe(concat('index.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
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