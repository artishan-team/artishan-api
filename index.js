var options ={};

options.rootDir = __dirname;
options.libDir = options.rootDir + '/lib';
options.configDir = options.rootDir + '/config';
options.controllersDir = options.rootDir + '/controllers';
options.modelsDir = options.rootDir + '/models';
options.hapiPluginsDir = options.libDir + '/plugins';
options.jobsDir = options.libDir + '/jobs';

var Server = require('./lib/server');

module.exports = Server(options);
