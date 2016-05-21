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

    tg.for('/help', function () {
      if (chat.type === 'group') {
        _utils2.default.sendTextFile($, 'group-help.txt');
      } else {
        _utils2.default.sendTextFile($, 'private-help.txt');
      }
    });

    tg.for('/rules', function () {
      _utils2.default.sendTextFile($, 'rules.txt');
    });

    tg.for('/team', function () {
      _utils2.default.sendTextFile($, 'team.txt');
    });

    // tg.for('/settings', () => {
    //   // TODO Not implemented yet
    // })
  };
};

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;