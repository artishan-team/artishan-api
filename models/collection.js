var bcrypt = require('bcrypt-nodejs');

module.exports = function(Mongoose) {
  var ObjectId = Mongoose.Schema.ObjectId;
  var Collection = new Mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    created: { type: Date, required: true, default: Date.now },
    _contentId: { type: ObjectId }
  });

  Mongoose.model('Collection', Collection);
};
