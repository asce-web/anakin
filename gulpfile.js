const fs = require('fs')

const gulp = require('gulp')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')

const Homepage = require('./proto/class/Homepage.class.js')

gulp.task('home:compile', function (callback) {
  let contents = new Homepage(require('./proto/data.json')).compile()
  return fs.writeFile('./proto/home.html', contents, 'utf8', callback) // send callback here to maintain async dependency
})

gulp.task('home:lessc', function () {
  return gulp.src(`${__dirname}/proto/css/src/home.less`)
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(clean_css({
      level: {
        2: {
          overrideProperties: false,
          restructureRules: true,
        },
      },
    }))
    .pipe(gulp.dest('./proto/css/'))
})

gulp.task('home:build', ['home:compile', 'home:lessc'])
