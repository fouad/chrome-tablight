var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var $ = require("gulp-load-plugins")();

var paths = {
  sass: ['./src/styles/*.scss'],
  js: ['app/**/*.js'],
  html: ['app/templates/**/*.html'],
  app: ['app/**/*.*'],
  src: ['src/search/index.js', 'src/background/index.js'],
  dest: ['app/scripts/']
};

gulp.task('default', ['clean','sass', 'js']);

  gulp.task('watch', ['default'], function () {

    gulp.watch(paths.sass, ['sass'])
    gulp.watch(paths.js, ['js'])
    gulp.watch(paths.src, ['js']);
    gulp.watch(paths.html, ['templates'])
});

gulp.task('move-lib', function() {
  return gulp.src('./app/lib/**/*.*')
    .pipe(gulp.dest('./dist/lib/'))
});

gulp.task('clean', function() {
  return gulp.src(['app/scripts/background.js', 'app/scripts/search.js'], {read:false})
    .pipe($.clean())
})

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe($.sass())
    .pipe($.csso())
    .pipe($.concat('style.css'))
    .pipe(gulp.dest('./app/css/'))
    .on('end', done);
});

gulp.task('js:search', function() {
  var browserified = transform(function(filename) {
     var b = browserify(filename);
     return b.bundle();
   });

  return gulp.src(paths.src[0])
    .pipe(browserified)
    .pipe($.babel())
    .pipe($.concat('search.js'))
    .pipe($.size())
    .pipe(gulp.dest(paths.dest[0]));
});

gulp.task('js:background', function() {
  var browserified = transform(function(filename) {
     var b = browserify(filename);
     return b.bundle();
   });
  return gulp.src(paths.src[1])
    .pipe(browserified)
    .pipe($.babel())
    .pipe($.concat('background.js'))
    .pipe($.size())
    .pipe(gulp.dest(paths.dest[0]));
});

gulp.task('js', ['js:background', 'js:search']);

gulp.task('reload', function() {

});