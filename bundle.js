var fs = require('fs');
var path = require('path');

var resources = fs.readdirSync(path.resolve(__dirname, 'dist/js'));
var script = resources.filter(resource => !resource.endsWith('.map'))[0];

var bundle = {
    bootstrap3: [path.join('/js/', script)]
};

fs.writeFileSync(path.resolve(__dirname, 'dist/bundle.json'), JSON.stringify(bundle, null, 4), 'utf-8');