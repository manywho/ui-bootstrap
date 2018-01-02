var fs = require('fs');
var path = require('path');

var jsResources = fs.readdirSync(path.resolve(__dirname, 'dist/js'));
var cssResources = fs.readdirSync(path.resolve(__dirname, 'dist/css'));

var stylesheets = cssResources.filter(resource => resource.endsWith('.css'));
var script = jsResources.filter(resource => !resource.endsWith('.map'))[0];

var bundle = {
    bootstrap3: [path.join('/js/', script)]
};

stylesheets.forEach(function(stylesheet) {
    bundle.bootstrap3.push(path.join('/css/', stylesheet));
}, this);

fs.writeFileSync(path.resolve(__dirname, 'dist/bundle.json'), JSON.stringify(bundle, null, 4), 'utf-8');