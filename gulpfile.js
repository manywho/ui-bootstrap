var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var path = require('path');
var del = require('del');

function getTask(task) {
    return require('./gulp-tasks/' + task)(gulp, plugins, argv);
}

function getDeployTask(task, cacheControl, src) {
    return require('./gulp-tasks/deploy/' + task)(gulp, plugins, argv, cacheControl, src);
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

gulp.task('dist-hashes', ['dist-ts', 'dist-less', 'dist-bootstrap', 'dist-bootstrap-themes', 'dist-fonts'], function() {
    return gulp.src(['css/*.css', 'js/*.js'], { cwd: './dist' })
        .pipe(plugins.filelist('ui-bootstrap-hashes.json'))
        .pipe(plugins.jsonEditor(function(hashes) {
            return hashes.map(function(hash) {
                return '/' + hash;
            });
        }))
        .pipe(gulp.dest('./dist'));  
});

gulp.task('dist-clean', function() {
    return del('./dist/**/*');
})

gulp.task('dist', ['dist-hashes']);

// Deploy
gulp.task('deploy-assets', getDeployTask('cdn', 'max-age=315360000, no-transform, public', ['dist/js/*.js', 'dist/js/*.js.map', 'dist/css/*.css', 'dist/css/*.css.map', 'dist/css/themes/*.css', 'dist/css/fonts/*.*']));
gulp.task('deploy-hashes', getDeployTask('cdn', 'no-cache', ['dist/ui-bootstrap-hashes.json']));
