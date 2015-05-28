var debug = require('debug')('controller:auth');
var Joi = require('joi');

module.exports = function(server) {

  var UserModel = server.app.mongoose.models.User;
  var TokenModel = server.app.mongoose.models.Token;

  server.route([
  {
    method: 'POST',
    path: '/auth/login',
    config: {
      description: 'Login',
      notes: 'login api',
      tags: ['auth', 'api'],
      validate: {
        payload: {
          email: Joi.string().email().required().description('User email'),
          password: Joi.string().required().description('User password')
        }
      }
    },
    handler: function(req, reply) {
      UserModel.signin({
        email: req.payload.email,
        password: req.payload.password
      }, function(err, user) {
        if (err) {
          return reply(err);
        }
        user.remoteaddress = req.info.remoteAddress;
        TokenModel.requestToken(user, function(err, token){
          if (err) {
            return reply(err);
          }
          return reply({
            accessToken: token.accessToken,
            userName: token.userName,
            userScope: token.userScope
          });
        });
      });
    }
  },
  {
    method: 'POST',
    path: '/auth/register',
    config: {
      description: 'Auth:register',
      notes: 'User register',
      tags: ['auth', 'api'],
      validate: {
        payload: {
          email: Joi.string().email().required(),
          name: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    },
    handler: function(req, reply) {
      var payload = req.payload;
      var server = req.server;
      UserModel.signup({
        isActive: true,
        email: payload.email,
        name: payload.name,
        password: payload.password
      }, function(err, result) {
        if (err) {
          return reply(err);
        }
        return reply(result).code(201);
      });
    }
  },
  {
    method: 'GET',
    path: '/tokentest',
    config: {
      auth: 'token'
    },
    handler: function(req, reply) {
      reply(req.auth.credentials);
    }
  },
  {
    method: 'GET',
    path: '/auth/google',
    config: {
      auth: 'google'
    },
    handler: function(req, reply) {
      UserModel.signup({
        isActive: true,
        email: req.auth.credentials.profile.email,
        name: req.auth.credentials.profile.displayName,
        password: req.auth.credentials.profile.email
      }, function(err, user) {
        if (err) {
          return reply(err);
        }
        user.remoteaddress = req.info.remoteAddress;
        TokenModel.requestToken(user, function(err, token){
          if (err) {
            return reply(err);
          }
          return reply({
            user: user,
            token: token
          }).code(201);
        });

      });
    }
  }
  ]);
};
