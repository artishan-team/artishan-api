var Bcrypt = require('bcrypt-nodejs');
var Boom = require('boom');

module.exports = function(Mongoose) {
  var ObjectId = Mongoose.Schema.ObjectId;
  var Tag = new Mongoose.Schema({
    sortIndex: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String },
    created: { type: Date, required: true, default: Date.now },
    _contentId: [ ObjectId ]
  });

  Tag.method({
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  });

  Tag.statics.getType = function(options, callback) {
    var self = this;
    self.findOne({ type: options.type }, function(err, tag) {

      if (err) {
        callback(err);
        return;
      }

      if (tag) {
        callback(null, null);
        return;

      } else {

        var newUser = {
          email: options.email,
          password: self.generateHash(options.password)
        };

        self.create(newUser, function(err) {
          if (err) {
            callback(err);
          }
          callback(null, newUser);
        });
      }

    });

  };

  Mongoose.model('Tag', Tag);
};
