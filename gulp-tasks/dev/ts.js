module.exports = function(gulp, plugins, argv) {
    return function() {
        var tsProject = plugins.typescript.createProject('tsconfig.json', {
            typescript: require('typescript')
        });
        return gulp.src(['js/components/*.ts', 'js/components/*.tsx', 'js/services/*.ts'], { base: 'js' })
            .pipe(plugins.tslint({
                formatter: 'verbose'
            }))
            .pipe(plugins.tslint.report({
                summarizeFailureOutput: true,
                emitError: false
            }))
            .pipe(plugins.addSrc(['js/components/*.js', 'js/lib/*.js']))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.typescript(tsProject))
            .pipe(plugins.sourcemaps.write())
            .pipe(gulp.dest(argv.jsDir || 'build/js'));
    }
};