const gulp = require('gulp');
const browserSync = require('browser-sync');
const gulpInject = require('gulp-inject');
const angularFilesort = require('gulp-angular-filesort');

const conf = require('../gulp.conf');

gulp.task('inject', inject);

function inject() {
    const injectScripts = gulp.src([
        conf.path.tmp('app/**/*.js')
    ]).pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

    const injectOptions = {
        ignorePath: [conf.paths.src, conf.paths.tmp],
        addRootSlash: false
    };

    return gulp.src(conf.path.src('index.html'))
        .pipe(gulpInject(gulp.src([
            conf.path.tmp('vendor/*.js')
        ], { read: false }), {
            name: 'head',
            ignorePath: [conf.paths.src, conf.paths.tmp],
            addRootSlash: false
        }))
        .pipe(gulpInject(injectScripts, injectOptions))
        .pipe(gulp.dest(conf.path.tmp()))
        .pipe(browserSync.stream());
};