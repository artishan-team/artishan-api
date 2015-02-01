var options ={};

options.rootDir = __dirname;
options.libDir = options.rootDir + '/lib';
options.configDir = options.rootDir + '/config';
options.controllersDir = options.rootDir + '/controllers';
options.modelsDir = options.rootDir + '/models';
options.hapiPluginsDir = options.libDir + '/hapi-plugins';

var Server = require('./lib/server');

module.exports = Server(options);
