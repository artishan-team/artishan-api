var good = require('good');
var goodConsole = require('good-console');

module.exports = function(hapi) {
  var options = {
    opsInterval: 1000,
    reporters: [{
      reporter: goodConsole,
      args:[{ log: '*', response: '*' }]
    }]
  };
  hapi.register({
    register: good,
    options: options
  }, function (err) {
    if (err) {
      console.error(err);
    }
  });
};
