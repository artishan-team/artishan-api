var Joi = require('joi');

module.exports = function(server) {

var DeckModel = server.app.mongoose.models.Deck;

server.route([
{
  method: 'GET',
  path: '/deck',
  config: {
    description: 'Get deck list',
    tags: ['api', 'deck']
  },
  handler: function(req, reply){
    DeckModel.find({}, '_id title meta', function(err, decks){
      if(err) { console.log(err); }
      return reply(decks);
    });
  }
},
{
  method: ['POST'],
  path: '/deck',
  config: {
    description: 'Create deck',
    tags: ['api', 'deck'],
    validate: {
      payload: {
        title: Joi.string().required(),
        meta: {
          description: Joi.string().default(''),
        }
      }
    }
  },
  handler: function(req, reply){
    DeckModel.create({
      _userId: '54e371babac5d39b5f8154ef',
      title: req.payload.title,
      meta: {
        description: req.payload.meta.description
      }
    }, function(err, newDeck){
      if(err) {
        console.log('error:', err);
        return reply(err); }

      return reply(newDeck);
    });
  }
},
{
  method: 'GET',
  path: '/deck/{deckId}',
  config: {
    description: 'Get deck',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required()
      }
    }
  },
  handler: function(req, reply){
    DeckModel.findOne({ _id: req.params.deckId }, function(err, decks){
      if(err) { return reply(err); }
      return reply(decks);
    });
  }
},
{
  method: 'PUT',
  path: '/deck/{deckId}',
  config: {
    description: 'Update deck',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required()
      },
      payload: {
        title: Joi.string().required(),
        meta: {
          description: Joi.string().default(''),
        }
      }
    }
  },
  handler: function(req, reply){
    DeckModel.update(
      {
        _id: req.params.deckId
      },
      req.payload,
      function(err, decks){
      if(err) { return reply(err); }
      return reply(decks);
    });
  }
},
{
  method: 'DELETE',
  path: '/deck/{deckId}',
  config: {
    description: 'Delete deck',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required()
      }
    }
  },
  handler: function(req, reply){
    console.log(req.params.deckId);
    DeckModel.remove({ _id: req.params.deckId }, function(err){
      if(err) { return reply(err); }
      return reply({result: 'ok'});
    });
  }
},
{
  method: ['GET'],
  path: '/deck/{deckId}/slide',
  config: {
    description: 'Get slide list',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required()
      }
    }
  },
  handler: function(req, reply){
    DeckModel.findOne({ _id: req.params.deckId }, 'slides.content', function(err, decks){
      if(err) { return reply(err); }
      console.log(decks.slides);
      return reply(decks.slides);
    });
  }
},
{
  method: ['GET'],
  path: '/deck/{deckId}/slide/{slideId}',
  config: {
    description: 'Get slide',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required(),
        slideId: Joi.string().required()
      }
    }
  },
  handler: function(req, reply){
    var deckId = req.params.deckId,
        slideId = req.params.slideId;
    DeckModel.findOne(
    {
      _id : deckId,
      slides : {
        $elemMatch: {
          _id : slideId
        }
      }
    },
    {
      "slides.$" : 1
    },
    function(err, slide){
    if(err) { return reply(err); }
      return reply(slide.slides[0]);
    });
  }
},
{
  method: ['POST'],
  path: '/deck/{deckId}/slide',
  config: {
    description: 'Create slide',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required()
      },
      payload: {
        slide:{
          content: Joi.string().default(''),
          position: {
            x: Joi.number().default(0),
            y: Joi.number().default(0)
          }
        }
      }
    }
  },
  handler: function(req, reply){
    var newSlide = req.payload;
        newSlide.deckId = req.params.deckId;
    if(!newSlide.slide) {
      newSlide.slide = {
        content: "",
        position: {
          x: 0,
          y: 0
        }
      };
    }
    DeckModel.pushSlide(newSlide, function(err, result){
      if(err) { return reply(err); }
      return reply(result);
    });
  }
},
{
  method: ['PUT'],
  path: '/deck/{deckId}/slide/{slideId}',
  config: {
    description: 'Update slide',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required(),
        slideId: Joi.string().required()
      },
      payload: {
        slide:{
          _id: Joi.string(),
          created: Joi.string(),
          content: Joi.string(),
          position: {
            x: Joi.number().default(0),
            y: Joi.number().default(0)
          }
        }
      }
    }
  },
  handler: function(req, reply){
    var payload = req.payload,
        deckId = req.params.deckId,
        slideId = req.params.slideId;
        console.log(req.params.slideId);
    DeckModel.updateSlide(
      {
        deckId: deckId,
        slideId: slideId,
        slide: payload.slide
      },
      function(err, changeSlide){
        if(err) { return reply(err); }
        return reply({
          result: changeSlide
        });
      }
    );
  }
},
{
  method: 'DELETE',
  path: '/deck/{deckId}/slide/{slideId}',
  config: {
    description: 'Delete slide',
    tags: ['api', 'deck'],
    validate: {
      params: {
        deckId: Joi.string().required(),
        slideId: Joi.string().required()
      }
    }
  },
  handler: function(req, reply){
    var deckId = req.params.deckId,
        slideId = req.params.slideId;
    DeckModel.remove(
      {
        _id : deckId,
        slides : {
          $elemMatch: {
            _id : slideId
          }
        }
      }, function(err){
      if(err) { return reply(err); }
      return reply({result: 'ok'});
    });
  }
}
]);

};
