var bcrypt = require('bcrypt-nodejs');

module.exports = function(Mongoose) {

  var ObjectId = Mongoose.Schema.ObjectId;

  var Tag = new Mongoose.Schema({
    _tagID: { type: ObjectId, required: true, ref: 'Tag' },
    name: { type: String, required: true }
  });

  var Slide = new Mongoose.Schema({
    position : {
      x: { type: Number },
      y: { type: Number }
    },
    content: { type: String },
    created: { type: Date, required: true, default: Date.now }
  });

  var Comment = new Mongoose.Schema({
    userID: { type: ObjectId },
    content: { type: String },
    modified: { type: Date, required: true, default: Date.now },
    created: { type: Date, required: true, default: Date.now },
  });

  var Deck = new Mongoose.Schema({
    _userId : { type: ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    meta: {
      theme: { type: String },
      customStyle: { type: String },
      description: { type: String },
      modified: { type: Date, required: true, default: Date.now },
      created: { type: Date, required: true, default: Date.now }
    },
    likes : [ObjectId],
    tags : [Tag],
    slides : [Slide],
    comments : [Comment]
  });

  Deck.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  Deck.method({
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  });

  Deck.statics.createDeck = function(options, callback) {
    var self = this;
    self.create({
      author: options.userId,
      title: options.title,
      meta: {
        description: options.description
      }
    }, function(err, newDeck) {
      if (err) {
        console.log('에러');
        console.error(err);
        callback(err);
      }
      callback(null, newDeck);
    });
  };

  Deck.statics.pushSlide = function(options, callback) {
    var self = this;

    self.update(
      { _id: options.deckId },
      {
        $set : {
          'meta.modified': Date.now()
        },
        $push: {
          slides: options.slide
        }
      },function(err, createSlide){
        console.log(createSlide);
        if(err){
          console.error(err);
          callback(err);
        }
        callback(null, createSlide);
    });
  };

  Deck.statics.updateSlide = function(options, callback) {
    var self = this;
    self.update(
      {
        '_id': options.deckId,
        'slides._id': options.slideId
      },
      {
        $set: {
          "slides.$.content" : options.slide.content
        }
      },
      {
        multi : false
      },
      function(err, changeSlide){
        if(err){
          console.error(err);
          callback(err);
        }
        callback(null, changeSlide);
    });
  };

  Mongoose.model('Deck', Deck);
};
