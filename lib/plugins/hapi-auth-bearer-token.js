var Boom = require('boom');

module.exports = function(hapi) {

  hapi.register(require('hapi-auth-bearer-token'), function (err) {
      hapi.auth.strategy('token', 'bearer-access-token', {
          allowQueryToken: true,
          allowMultipleHeaders: false,
          accessTokenName: 'access_token',
          validateFunc: function( targetToken, callback ) {
              var TokenModel = hapi.app.mongoose.models.Token;
              TokenModel.checkAccessToken(targetToken,function(err, token){
                if(token){
                  if(!token.vaildExpired()){
                    TokenModel.remove({token: targetToken}, function(err){
                      if(err) {
                        console.error(err);
                      }
                    });
                    callback(Boom.unauthorized('Invalid or expired token'), false);
                    return;
                  }
                  callback(null, true, {
                    userId: token._userId,
                    userName: token.userName,
                    userGroup: token.userGroup
                  });
                  return;
                }
                callback(null, false);
                return;
              });
          }
      });
  });

};
