var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    del           = require('del'),
    concat        = require('gulp-concat'),
    browserSync   = require('browser-sync').create(),
    babel         = require('gulp-babel'),
    cache         = require('gulp-cache'),
    imagemin      = require('gulp-imagemin'),
    newer         = require('gulp-newer'),
    uglify        = require('gulp-uglify');

gulp.task('serve', ['sass', 'scripts'], function() {
  browserSync.init({
    server: "./src"
  });
  gulp.watch("src/**/*.+(scss|sass)", ['sass']).on('change', browserSync.reload);
  gulp.watch("src/**/*.js", ['scripts']).on('change', browserSync.reload);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

gulp.task('sass', function(){
  return gulp.src('src/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'IE 8', 'IE 9', 'IE 10'],
      grid: true
    }))
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(newer('dist/images'))
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('build', ['clean', 'images', 'sass', 'scripts'], function() {

  const css = gulp.src('src/css/main.min.css')
  .pipe(gulp.dest('dist/css'))

  const fonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))

  const js = gulp.src('src/js/main.min.js')
  .pipe(gulp.dest('dist/js'))

  const html = gulp.src('src/index.html')
  .pipe(gulp.dest('dist'));

});

gulp.task('clean', function() {
  return del.sync('dist');
});