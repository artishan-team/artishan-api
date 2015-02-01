var debug = require('debug')('auth:handler');
/** @module auth */


exports.userRegister = function (request, reply) {
  var server = request.server;
  var UserModel = server.app.mongoose.models.User;

  UserModel.create({
    email: request.auth.credentials.profile.email,
    name: 'test',
    provider: request.auth.credentials.provider,
    token: request.auth.credentials.token,
    password: 'password'
  }, function(err, model) {
    if (err) {
      console.log(err);
    }
    reply({ created: true }).code(201);
    debug('created');
  });
};


/**
* userRegister
* @function
* @param {Object} request - Hapi Request
* @param {Object} reply - Hapi Reply
*/
exports.userRegister = function (request, reply) {
  var server = request.server;
  var UserModel = server.app.mongoose.models.User;

  UserModel.create({
    email: request.auth.credentials.profile.email,
    name: 'test',
    provider: request.auth.credentials.provider,
    token: request.auth.credentials.token,
    password: 'password'
  }, function(err, model) {
    if (err) {
      console.log(err);
    }
    reply({ created: true }).code(201);
    debug('created');
  });
};

/**
* GoogleOauth
* @function
* @param {Object} request - Hapi Request
* @param {Object} reply - Hapi Reply
*/
exports.google2callback =  function (request, reply) {
  var server = request.server;
  var UserModel = server.app.mongoose.models.User;
  var token = request.auth.credentials.token;
  // UserModel.

  var googleProfile = {
    email: request.auth.credentials.profile.email,
    name: request.auth.credentials.profile.name,
    provider: request.auth.credentials.provider,
    token: request.auth.credentials.token
  };

  reply(googleProfile);
  // reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
};
