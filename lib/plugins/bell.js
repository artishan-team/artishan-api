var bell = require('bell');

module.exports = function(hapi) {
  var config = hapi.app.config;
  console.log(config);
  hapi.register(bell, function (err) {
    if (err) {
      console.error(err);
    }
    hapi.auth.strategy('google', 'bell', {
      provider: 'google',
      password: 'password',
      isSecure: false,
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      providerParams: {
        redirect_uri: hapi.info.uri + '/auth/google2callback'
      }
    });

  });
};
