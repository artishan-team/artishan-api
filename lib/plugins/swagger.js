var pack = require('../../package'),
    swaggerOptions = {
        basePath: 'http://localhost:3000',
        apiVersion: pack.version
    };

module.exports = function(hapi) {
  hapi.register({
      register: require('hapi-swagger'),
      options: swaggerOptions
  }, function (err) {
      if (err) {
          console.log(['error'], 'hapi-swagger load error: ' + err);
      }else{
          console.log(['start'], 'hapi-swagger interface loaded');
      }
  });
};
