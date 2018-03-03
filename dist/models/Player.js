'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
  _id: Number,
  first_name: String,
  last_name: String,
  group: {
    id: Number,
    name: String,
    role: String
  }
}, {
  timestamps: true
});

playerSchema.statics.getByIds = function getByIds(ids, callback) {
  return this.find({
    _id: {
      $in: ids
    }
  }, function (err, players) {
    callback(err, players);
  });
};

playerSchema.methods.joinMatch = function joinMatch(newPlayer, callback) {
  return this.model('Player').findOne({
    _id: newPlayer._id
  }, function (err, player) {
    if (err) {
      return console.error(err);
    }
    // Player already created
    if (player) {
      return callback(null);
    }
    newPlayer.save(function (err) {
      callback(err);
    });
  });
};

exports.default = mongoose.model('Player', playerSchema);