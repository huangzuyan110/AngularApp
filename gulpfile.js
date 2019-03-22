var gulp = require('gulp');
var { series, parallel } = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
	srcPath: 'src/',
	devPath: 'build/',
	prdPath: 'dist/'
}

gulp.task('lib', function(cd){
	gulp.src('bower_components/**/*.js')
	.pipe(gulp.dest(app.devPath + 'vendor'))
	.pipe(gulp.dest(app.prdPath + 'vendor'))
  	.pipe($.connect.reload());

  	cd();
})

gulp.task('html', function(cd){
	gulp.src(app.srcPath + '**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe(gulp.dest(app.prdPath))
  	.pipe($.connect.reload());

  	cd();
})

gulp.task('json', function(cd) {
  	gulp.src(app.srcPath + 'data/**/*.json')
  	.pipe(gulp.dest(app.devPath + 'data'))
  	.pipe(gulp.dest(app.prdPath + 'data'))
  	.pipe($.connect.reload());

  	cd();
});

gulp.task('less', function(cd) {
  	gulp.src(app.srcPath + 'style/index.less')
  	.pipe($.plumber())
  	.pipe($.less())
  	.pipe(gulp.dest(app.devPath + 'css'))
  	.pipe($.cssmin())
  	.pipe(gulp.dest(app.prdPath + 'css'))
  	.pipe($.connect.reload());

  	cd();
});

gulp.task('js', function(cd) {
	gulp.src(app.srcPath + 'script/**/*.js')
	.pipe($.plumber())
	.pipe($.concat('index.js'))
	.pipe(gulp.dest(app.devPath + 'js'))
	.pipe($.uglify())
	.pipe(gulp.dest(app.prdPath + 'js'))
	.pipe($.connect.reload());

	cd();
});

gulp.task('image', function(cd) {
	gulp.src(app.srcPath + 'image/**/*')
	.pipe($.plumber())
	.pipe(gulp.dest(app.devPath + 'image'))
	.pipe($.imagemin())
	.pipe(gulp.dest(app.prdPath + 'image'))
	.pipe($.connect.reload());

	cd();
});

gulp.task('build',parallel('image', 'js', 'less', 'lib', 'html', 'json'));

gulp.task('clean', function(cd) {
	gulp.src([app.devPath, app.prdPath])
	.pipe($.clean());

	cd();
});

gulp.task('serve', series('build', function(cd) {
	$.connect.server({
		root: [app.devPath],
		livereload: true,
		port: 3000
	});

	open('http://localhost:3000');

	gulp.watch('bower_components/**/*', parallel('lib'));
	gulp.watch(app.srcPath + '**/*.html', parallel('html'));
	gulp.watch(app.srcPath + 'data/**/*.json', parallel('json'));
	gulp.watch(app.srcPath + 'style/**/*.less', parallel('less'));
	gulp.watch(app.srcPath + 'script/**/*.js', parallel('js'));
	gulp.watch(app.srcPath + 'image/**/*', parallel('image'));

	cd();
}));

gulp.task('default', parallel('serve'));
