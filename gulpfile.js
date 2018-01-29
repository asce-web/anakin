const gulp = require('gulp')
const pug = require('gulp-pug')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('pug:home', function () {
  return gulp.src(__dirname + '/proto/home.pug')
    .pipe(pug({
      basedir: './',
      locals: {
        database: require('./proto/data.json'),
      },
    }))
    .pipe(gulp.dest('./proto/'))
})

gulp.task('lessc:home', function () {
  return gulp.src(__dirname + '/proto/css/src/home.less')
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./proto/css/'))
})
