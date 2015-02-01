var debug = require('debug')('controller:auth');
var handler = require('./handler');

module.exports = [
  {
    method: 'GET',
    path: '/auth/register',
    config: {
      auth: 'google',
      handler: handler.userRegister
    }
  },
  {
    method: 'GET',
    path: '/auth/google',
    config: {
      auth: 'google',
      handler: handler.google2callback
    }
  }
];
