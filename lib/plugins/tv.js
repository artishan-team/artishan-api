var Tv = require('tv');

module.exports = function(hapi) {
  hapi.register(Tv, function (err) {

    if (err) {
      console.error(err);
    }
    
  });
};
