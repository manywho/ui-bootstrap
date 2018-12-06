const path = require('path');
const writefile = require('write-file');

function WriteBundleFile(options) { 
    this.options = options; 
}

WriteBundleFile.prototype.apply = function (compiler) {

    const options = this.options;

    compiler.plugin('emit', function (compilation, callback) {

        // We're only emitting one chunk
        const [ chunk ] = compilation.chunks;

        const filteredFiles = chunk.files.filter(options.filenameFilter);

        const correctedFilePaths = filteredFiles.map(
            filename => options.pathPrefix + filename,
        );

        // bundle file contents
        const bundle = {};
        bundle[options.bundleKey] = correctedFilePaths;

        writefile(path.resolve(__dirname, 'dist', 'bundle.json'), bundle, callback);
    });
};

module.exports = WriteBundleFile;