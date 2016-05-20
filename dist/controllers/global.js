'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    // let user = $.user

    tg.for('/start', function () {
      if (chat.type === 'private') {
        _utils2.default.sendTextFile($, 'private-help.txt');
      }
    });

    tg.for('/settings', function () {
      // TODO Not implemented yet
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;