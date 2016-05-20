const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'))
  .on('error', function (err) {
    console.error(err)
  })
})

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('watch', () => {
  return gulp.watch('src/**/*.js', ['lint', 'babel'])
})

gulp.task('default', ['lint', 'babel'])
