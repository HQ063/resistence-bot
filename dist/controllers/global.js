'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    // let user = $.user

    tg.for('/start', function () {
      _utils2.default.sendTextFile($, 'private-help.txt');
    });

    tg.for('/settings', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) throw err;
        $.sendMessage(JSON.stringify(group, null, 2));
      });
    });

    tg.for('/help', function () {
      _utils2.default.sendTextFile($, 'group-help.txt');
    });

    tg.for('/rules', function () {
      _utils2.default.sendTextFile($, 'rules.txt');
    });
  };
};

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;