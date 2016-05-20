'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../controllers/utils');

var _utils2 = _interopRequireDefault(_utils);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupSchema = _mongoose2.default.Schema({
  _id: Number,
  name: String,
  host: Object,
  users: Array,
  score_spy: {
    type: Number,
    default: 0
  },
  score_resistance: {
    type: Number,
    default: 0
  },
  mission: {
    players: Array,
    votes: Array
  }
}, {
  timestamps: true
});

groupSchema.statics.mission = function mission(_id, players, callback) {
  var _this = this;

  return this.findOne({
    _id: _id
  }, function (err, group) {
    if (err) {
      return callback(err);
    }

    var usersId = _utils2.default.zipWithIndex(group.users).filter(function (tuple) {
      return _lodash2.default.includes(players, tuple[0]);
    }).map(function (tuple) {
      return tuple[1];
    });

    _this.update({
      _id: _id
    }, {
      $set: {
        mission: {
          players: usersId
        }
      }
    }, callback);
  });
};

exports.default = _mongoose2.default.model('Group', groupSchema);