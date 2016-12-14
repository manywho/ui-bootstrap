module.exports = function(gulp, plugins, argv) {
    return function() {
        return gulp.src('css/mw-bootstrap.less')
            .pipe(plugins.less())
            .pipe(plugins.replace('.mw-bs html {', '.mw-bs {'))
            .pipe(plugins.replace('.mw-bs body {', '.mw-bs {'))
            .pipe(plugins.cleanCss({
                keepSpecialComments: 0,
                processImportFrom: ['!fonts.googleapis.com']
            }))
            .pipe(plugins.rev())
            .pipe(gulp.dest(argv.cssDir || './dist/css'))
    }
}