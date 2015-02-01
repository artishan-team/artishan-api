// Load modules

var debug = require('debug')('common:server');
var fs = require("fs");
var Mongoose = require('mongoose');
var Hapi = require('hapi');

// Declare internals
var internals = {};

internals.requireConfig = function (dir) {
  return require(dir + '/development.json');
};

internals.requireMongoose = function (connectionString) {
  var client = Mongoose.connect(connectionString);
  return client;
};

internals.requireModules = function (client, dir) {
  fs.readdirSync(dir).forEach(function(file) {
    var requireDir = dir + '/' + file;
    require(requireDir)(client);
  });
};

internals.requireFolderModules = function (client, dir) {
  fs.readdirSync(dir).forEach(function(file) {
    var requireDir = dir + '/' + file;
    fs.stat(requireDir, function(err, stat) {
      if (stat && stat.isDirectory()) {
        require(requireDir)(client);
      }
    });
  });
};

internals.requireDirectory = function (dir, callback) {
  fs.readdirSync(dir).forEach(function(file) {
    var requireDir = dir + '/' + file;
    fs.stat(requireDir, function(err, stat) {
      if (stat && stat.isDirectory()) {
        callback(require(requireDir));
      }
    });
  });
};

exports = module.exports = internals.Server = function (options) {

  var config = internals.requireConfig(options.configDir);
  var hapi = new Hapi.Server(config.hapi.options);
  var mongoose = Mongoose.connect(config.mongodb.connectionString);

  // Model import
  internals.requireModules(mongoose, options.modelsDir);

  // Server connection
  hapi.connection(config.hapi.connection);

  // App dependency
  hapi.app = {
    mongoose: mongoose,
    config: config
  };

  // Register plug-in
  internals.requireModules(hapi, options.hapiPluginsDir);

  // Register controllers
  internals.requireDirectory(options.controllersDir, function(data){
    hapi.route(data);
  });

  // Server start
  hapi.start(function () {
    console.log('Server started at port ' + hapi.info.port);
  });
};
