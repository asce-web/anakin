const gulp = require('gulp')
const pug = require('gulp-pug')

gulp.task('pug:home', function () {
  return gulp.src(__dirname + '/proto/home.pug')
    .pipe(pug({
      basedir: './',
      locals: {
      },
    }))
    .pipe(gulp.dest('./proto/'))
})
