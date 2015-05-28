var bcrypt = require('bcrypt-nodejs');

module.exports = function(Mongoose) {
  var ObjectId = Mongoose.Schema.ObjectId;
  var Post = new Mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    modified: { type: Date, required: true, default: Date.now },
    created: { type: Date, required: true, default: Date.now },
    _parentsId: { type: ObjectId }
  });

  Post.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  Post.method({
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  });

  Post.statics.getList = function(options, callback) {
    var self = this;
    this.findOne({ email: options.email }, function(err, user) {

      if (err) {
        callback(err);
        return;
      }

      if (user) {
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

  Mongoose.model('Post', Post);
};
