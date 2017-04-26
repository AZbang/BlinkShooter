const gulp = require('gulp');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");

var errorMessage = () => {
	return plumber({errorHandler: notify.onError((err) => {
		return {
			title: err.name,
			message: err.message
		}
	})})
}

gulp.task('coffee', () => {
	return gulp.src('./coffee/index.coffee', {read: false})
			.pipe(errorMessage())
			.pipe(browserify({ 
				transform: ['coffeeify'], 
				extensions: ['.coffee'] 
			}))
			.pipe(concat('index.js'))
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
	gulp.watch('./coffee/**/*.*', ['coffee']);
});

// Tasks
gulp.task('default', ['coffee', 'server', 'watch']);