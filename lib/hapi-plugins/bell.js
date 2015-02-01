var bell = require('bell');

module.exports = function(hapi) {
  hapi.register(bell, function (err) {

    if (err) {
      console.error(err);
    }

    hapi.auth.strategy('google', 'bell', {
      provider: 'google',
      password: 'password',
      isSecure: false,
      // You'll need to go to https://console.developers.google.com and set up an application to get started
      // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
      // Next, go to "APIs & auth >> Credentials and Create new Client ID
      // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
      // This will net you the clientId and the clientSecret needed.
      // Also be sure to pass the redirect_uri as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
      clientId: '424015129757-v8c5p7jdfvn0262rg9rabaluetpptfsc.apps.googleusercontent.com',
      clientSecret: 'eRcCbudhYWF_3HwoCWePpUH3',
      providerParams: {
        redirect_uri: hapi.info.uri + '/auth/google2callback'
      }
    });

    hapi.route({
      method: ['GET', 'POST'],        // Must handle both GET and POST
      path: '/auth/google2callback',          // The callback endpoint registered with the provider
      config: {
        auth: 'google',
        handler: function (request, reply) {
          return reply.redirect('/auth/google2callback');
          // reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
        }
      }
    });
  });

};
