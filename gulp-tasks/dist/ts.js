module.exports = function(gulp, plugins, argv) {
    return function() {
        var tsProject = plugins.typescript.createProject('tsconfig.json', {
            typescript: require('typescript')
        });

        return gulp.src(['js/components/*.*', 'js/lib/*.*'], { base: 'js' })
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.typescript(tsProject))
            .pipe(plugins.uglify({
                preserveComments: 'license'
            }).on('error', plugins.util.log))
            .pipe(plugins.rev())
            .pipe(plugins.rename(function(path) {
                if (argv.jsOrder)
                    path.basename = argv.jsOrder + '-' + path.basename;
            }))
            .pipe(plugins.sourcemaps.write('.', {
                sourceMappingURL: function(file) {
                    return argv.sourceMapUrlPrefixJs + file.relative + '.map';
                },
                includeContent: true
            }))
            .pipe(gulp.dest(argv.jsDir || './dist/js'))       
    }
}