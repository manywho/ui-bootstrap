module.exports = function(gulp, plugins, argv) {
    return function() {
        return gulp.src(['css/*.less', '!css/mw-bootstrap.less'])
            .pipe(plugins.lesshint())
            .pipe(plugins.lesshint.reporter())
            .pipe(plugins.addSrc(['css/lib/*.*', '!css/lib/bootstrap.css']))
            .pipe(plugins.concat('ui-bootstrap.less'))
            .pipe(plugins.less())
            .pipe(gulp.dest(argv.cssDir || 'build/css'));
    }
};