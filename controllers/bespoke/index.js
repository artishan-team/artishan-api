var handler = require("./handler");
var Joi = require('joi');

module.exports = [{
  method: 'GET',
  path: '/bespoke/manager',
  config: {
    handler: handler.getManager
  }
}, {
  method: 'GET',
  path: '/bespoke/decks',
  config: {
    handler: handler.getDecks
  }
}, {
  method: 'GET',
  path: '/bespoke/deck/{deckId}',
  config: {
    description: 'Get deck',
    notes: 'Returns a deck item by the id passed in the path',
    tags: ['bespoke'],
    handler: handler.getDeck
  }
}, {
  method: 'PUT',
  path: '/bespoke/deck',
  config: {
    handler: handler.putDeck
  }
}, {
  method: 'PUT',
  path: '/bespoke/deck/{deckId}',
  config: {
    handler: handler.putDeck
  }
}, {
  method: 'DELETE',
  path: '/bespoke/deck/{deckId}',
  config: {
    handler: handler.deleteDeck
  }
}, {
  method: 'GET',
  path: '/bespoke/slides/{deckId}',
  config: {
    handler: handler.getSlides
  }
}, {
  method: 'GET',
  path: '/bespoke/slide/{slideId}',
  config: {
    handler: handler.getSlide
  }
}, {
  method: 'PUT',
  path: '/bespoke/slide/{slideId}',
  config: {
    handler: handler.putSlide
  }
}, {
  method: 'PUT',
  path: '/bespoke/slide',
  config: {
    handler: handler.putSlide
  }
}, {
  method: 'DELETE',
  path: '/bespoke/slide/{slideId}',
  config: {
    handler: handler.deleteSlide
  }
}];
