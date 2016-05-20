const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const mocha = require('gulp-mocha')

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

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('test', () => {
  return gulp.src('tests/**/*.js')
    .pipe(mocha())
})

gulp.task('watch', () => {
  return gulp.watch('src/**/*.js', ['babel'])
})

gulp.task('default', ['lint', 'test', 'babel'])
