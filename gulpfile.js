var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var path = require('path'); 

function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, plugins, argv);
}

// Dev

gulp.task('dev-less', getTask('dev/less'));
gulp.task('dev-ts', getTask('dev/ts'));
gulp.task('dev-bootstrap', getTask('dev/bootstrap'));
gulp.task('dev-bootstrap-themes', getTask('dev/bootstrap-themes'));

gulp.task('dev-fonts', function () {
    return gulp.src('css/fonts/*.*').pipe(gulp.dest('./build/css/fonts'));
});

gulp.task('watch', ['dev-ts', 'dev-less', 'dev-bootstrap', 'dev-bootstrap-themes', 'dev-fonts'], function() {
    gulp.watch('css/*.less', ['dev-less', 'dev-bootstrap']);
    gulp.watch('css/themes/*.less', ['dev-bootstrap-themes']);
    gulp.watch(['js/**/*.*'], ['dev-ts']);
});

// Dist

gulp.task('dist-less', getTask('dist/less'));
gulp.task('dist-bootstrap', getTask('dist/bootstrap'));
gulp.task('dist-bootstrap-themes', getTask('dist/bootstrap-themes'));
gulp.task('dist-ts', getTask('dist/ts'));

gulp.task('dist-fonts', function () {
    var outputDir = './dist/css/fonts';
    if (argv.cssDir)
        outputDir = path.join(argv.cssDir, '/fonts');

    return gulp.src('css/fonts/*.*').pipe(gulp.dest(outputDir));
});

gulp.task('dist', ['dist-ts', 'dist-less', 'dist-bootstrap', 'dist-bootstrap-themes', 'dist-fonts']);
