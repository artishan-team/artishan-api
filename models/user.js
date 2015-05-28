var bcrypt = require('bcrypt-nodejs');
var Boom = require('boom');

module.exports = function(Mongoose) {

  var User = new Mongoose.Schema({
    isActive: { type: Boolean, required: true },
    email: { type: String, lowercase: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    scope: { type: [String] },
    created: { type: Date, default: Date.now }
  });

  User.virtual('userId').get(function() {
      return this._id;
  });

  User.method({
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  });

  User.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  User.statics.signin = function(options, callback) {
    var self = this;
    self.findOne({ email: options.email }, function(err, user) {
      if (err) {
        return callback(Boom.wrap(err, 500));
      }
      if (!user) {
        return callback(Boom.notFound('User not found'));
      }
      if (!user.validPassword(options.password)) {
        return callback(Boom.unauthorized('Invalid password'));
      }
      if (!user.isActive) {
        return callback(Boom.notAcceptable('User not active'));
      }
      callback(null, user);
    });
  };

  User.statics.signup = function(options, callback) {
    var self = this;
    self.findOne({ email: options.email }, function(err, user) {
      if (err) {
        return callback(Boom.wrap(err, 500));
      }
      if (user) {
        return callback(Boom.badRequest('User already exists'));
      }
      self.create({
        isActive: options.isActive,
        email: options.email,
        name: options.name,
        password: self.generateHash(options.password)
      }, function(err, user) {
        if (err) {
          return callback(Boom.wrap(err, 500));
        }
        return callback(null, {
          isActive: user.isActive,
          email: user.email,
          name: user.name,
          scope: user.scope
        });
      });

    });
  };

  Mongoose.model('User', User);
};
