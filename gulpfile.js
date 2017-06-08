var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var path = require('path');
var del = require('del');

function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, plugins, argv);
}

// Hooks
gulp.task('pre-commit', getTask('hooks/pre-commit'));  

// Dev
gulp.task('dev-less', getTask('dev/less'));
gulp.task('dev-ts', getTask('dev/ts'));
gulp.task('dev-bootstrap', getTask('dev/bootstrap'));
gulp.task('dev-bootstrap-themes', getTask('dev/bootstrap-themes'));

gulp.task('dev-fonts', function () {
    return gulp.src('css/fonts/*.*').pipe(gulp.dest((argv.build || './build') + '/css/fonts'));
});

gulp.task('watch', ['dev-ts', 'dev-less', 'dev-bootstrap', 'dev-bootstrap-themes', 'dev-fonts'], function() {
    gulp.watch(['css/*.less', '!css/mw-bootstrap.less'], ['dev-less']);
    gulp.watch(['css/mw-bootstrap.less'], ['dev-bootstrap']);
    gulp.watch(['css/themes/*.less'], ['dev-bootstrap-themes']);
    gulp.watch(['js/**/*.*'], ['dev-ts']);
});

// Dist
gulp.task('dist-less', ['dist-clean'], getTask('dist/less'));
gulp.task('dist-bootstrap', ['dist-clean'], getTask('dist/bootstrap'));
gulp.task('dist-bootstrap-themes', ['dist-clean'], getTask('dist/bootstrap-themes'));
gulp.task('dist-ts', ['dist-clean'], getTask('dist/ts'));

gulp.task('dist-fonts', ['dist-clean'], function () {
    return gulp.src('css/fonts/*.*').pipe(gulp.dest('./dist/css/fonts'));
});

gulp.task('dist-bundle', ['dist-ts', 'dist-less', 'dist-bootstrap', 'dist-bootstrap-themes', 'dist-fonts'], function() {
    return gulp.src(['css/*.css', 'js/*.js'], { cwd: './dist' })
        .pipe(plugins.filelist('bundle.json'))
        .pipe(plugins.jsonEditor(resources => {
            return {
                'bootstrap3': resources.map(resource => '/' + resource)
            }
        }))
        .pipe(gulp.dest('./dist'));  
});

gulp.task('dist-clean', function() {
    return del('./dist/**/*');
})

gulp.task('dist', ['dist-bundle']);
