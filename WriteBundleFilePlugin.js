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

        const stringifiedFileContents = JSON.stringify(bundle, null, 4);

        compilation.assets[options.filename] = {
            source: function() { return new Buffer(stringifiedFileContents); },
            size: function() { return Buffer.byteLength(stringifiedFileContents); }
        };

        callback();
    });
};

module.exports = WriteBundleFile;