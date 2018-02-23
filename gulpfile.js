const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const less         = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const clean_css    = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')

const Homepage = require('./proto/class/Homepage.class.js')

gulp.task('home:compile', function (callback) {
  return fs.readFile('./proto/database.jsonld', 'utf8', function (err, data) {
    let contents = new Homepage(JSON.parse(data)).compile()
    fs.writeFile('./proto/home.html', contents, 'utf8', callback) // send callback here to maintain async dependency
  })
})

gulp.task('home:lessc-each', function () {
  return gulp.src(path.resolve(__dirname, './proto/css/src/*.less'))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
    }))
    .pipe(gulp.dest('./proto/css/dist/'))
    .pipe(clean_css({
      level: {
        2: {
          overrideProperties: false,
          mergeMedia: false,
          restructureRules: true,
        },
      },
    }))
    .pipe(sourcemaps.write('./')) // write to an external .map file
    .pipe(gulp.dest('./proto/css/dist/'))
})

gulp.task('home:lessc', function () {
  return gulp.src(`${__dirname}/proto/css/src/home.less`)
    .pipe(less())
    .pipe(autoprefixer({
      grid: true,
      cascade: false,
    }))
    .pipe(gulp.dest('./proto/css/'))
    .pipe(sourcemaps.init())
    .pipe(clean_css({
      level: {
        2: {
          overrideProperties: false,
          mergeMedia: false,
          restructureRules: true,
        },
      },
    }))
    .pipe(sourcemaps.write('./')) // write to an external .map file
    .pipe(gulp.dest('./proto/css/'))
})

gulp.task('home:build', ['home:compile', 'home:lessc'])
