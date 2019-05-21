function WriteBundleFile(options) { 
    this.options = options; 
}

WriteBundleFile.prototype.apply = function (compiler) {

    const options = this.options;

    // eslint-disable-next-line prefer-arrow-callback
    compiler.plugin('emit', function (compilation, callback) {

        // We're only interested in the 'js/ui-bootstrap' chunk
        const chunk = compilation.chunks.find(chunk => chunk.name === 'js/ui-bootstrap');

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