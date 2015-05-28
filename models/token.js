var bcrypt = require('bcrypt-nodejs');
var Boom = require('boom');

module.exports = function(Mongoose) {

  var ObjectId = Mongoose.Schema.ObjectId;
  var Token = new Mongoose.Schema({
    accessToken: { type: String, required: true, unique: true, index: true },
    remoteAddress: { type: String },
    userName: { type: String, required: true },
    userScope: { type: [String] },
    created: { type: Date, default: Date.now },
    _userId: { type: ObjectId, required: true }
  });

  Token.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  Token.method({
    vaildExpired: function() {
      var tokenLife = 36000;
      if( Math.round((Date.now() - this.created)/1000) < tokenLife ) {
        return true;
      }else{
        return false;
      }
    }
  });

  Token.statics.checkAccessToken = function(accessToken, callback) {
    var self = this;

    self.findOne({ accessToken: accessToken }, function(err, token) {

      if (err) {
        return callback(Boom.badImplementation(err));
      }

      if(!token) {
        return callback(null, null);
      }

      callback(null, {
        accessToken: token.accessToken,
        userName: token.userName,
        userScope: token.userScope
      });

    });
  };

  Token.statics.requestToken = function(user, callback) {

    var self = this;
    self.findOne({ _userId: user.id }, function(err, activeToken) {
      if (err) {
        return callback(Boom.badImplementation(err));
      }
      if(activeToken) {
        return callback(null, activeToken);
      }

      var timeStamp = Math.round((new Date()).getTime() / 1000);
      var seed = user.id + timeStamp + Math.floor((Math.random() * 100));
      var newToken = {
        accessToken: self.generateHash(seed),
        remoteAddress: user.remoteAddress,
        userName: user.name,
        userScope: user.scope,
        _userId: user.id
      };
      self.create(newToken, function(err, createToeken) {
        if (err) {
          return callback(Boom.badImplementation(err));
        }
        return callback(null, createToken);
      });

    });
  };

  Mongoose.model('Token', Token);

};
