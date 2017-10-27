const gulp = require('gulp');
const browserSync = require('browser-sync');
const conf = require('../gulp.conf');

gulp.task('watch', watch);

function watch(done) {
    gulp.watch(conf.path.src('index.html'), gulp.series('inject'));
    
    gulp.watch([
        conf.path.src('**/*.js')
    ], gulp.series('scripts', 'inject'));

    gulp.watch([
        conf.path.src('**/*.scss')
    ], gulp.series('styles'));

    gulp.watch([
        conf.path.src('app/**/*.html')
    ], gulp.series('partials'));

    done();
}