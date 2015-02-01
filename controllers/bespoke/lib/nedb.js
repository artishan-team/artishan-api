// Require the nedb module
var Datastore = require('nedb'),
    path = require("path"),
    fs = require('fs');

var rootPath = path.normalize(__dirname + '/../../..');

// Initialize two nedb databases. Notice the autoload parameter.
var deck = new Datastore({ filename: rootPath + '/data/bespoke/deck', autoload: true });
var slide = new Datastore({ filename: rootPath + '/data/bespoke/slide', autoload: true });
var slideTag = new Datastore({ filename: rootPath + '/data/bespoke/slide_tag', autoload: true });
var slidePage = new Datastore({ filename: rootPath + '/data/bespoke/slide_page', autoload: true });

// Create a "unique" index for the photo name and user ip
slideTag.ensureIndex({fieldName: 'name', unique: true});

module.exports = {
  deck: deck,
  slide: slide,
  slideTag: slideTag,
  slidePage : slidePage
};
