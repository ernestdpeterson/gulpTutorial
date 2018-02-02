/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function(done) {
    gulp.watch('sass/**/*.scss', gulp.series('styles'));
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch('./index.html', gulp.series('copy-html'));
    gulp.watch(['./index.html', 'sass/main.scss']).on('change', browserSync.reload);
    browserSync.init({
        server: './'
    });
    done();
});

gulp.task('browserSync', function(done) {
    browserSync.stream();
    done();
});

gulp.task('lint', function() {
    return gulp.src(['js/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // alternatively us eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // to have the process exit when an error code (1) on
        // lint error, return the steam an pipe to fialOnError last.
        .pipe(eslint.failOnError());
});

gulp.task('styles', function(done) {
    gulp.src('sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/css'));
    done();
});

gulp.task('copy-html', function(done) {
    gulp.src('./index.html')
        .pipe((gulp.dest('./dist')));
    done();
});

gulp.task('copy-images', function(done) {
    gulp.src('./img/*')
        .pipe((gulp.dest('./dist/img')));
    done();
});

gulp.task('scripts', function(done) {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
    done();
});

gulp.task('scripts-dist', function(done) {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
    done();
});

gulp.task('dist', gulp.series(
    'copy-html',
    'copy-images',
    'styles',
    'lint',
    'scripts-dist'
));