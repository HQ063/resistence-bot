const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'))
  .on('error', function (err) {
    console.error(err);
  });
});

gulp.task('watch', () => {
  return gulp.watch('src/**/*.js', ['babel']);
})

gulp.task('default', ['babel']);
