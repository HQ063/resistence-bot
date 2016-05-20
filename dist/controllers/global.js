'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    var user = $.user;
    console.dir($);

    tg.for('/new', function () {
      if (chat && chat.type === 'group') {
        var group = new _Group2.default({
          _id: chat.id,
          name: chat.title,
          host: $.user // host starts the match
        });
        group.save(function (err, g) {
          if (err) {
            console.error(err);
            if (err.code === 11000) {
              $.sendMessage('Ops! A Match has already been started.');
            }
          } else {
            var message = '';
            message += '🎲 The Match has started 🎲\n🏁\n';
            message += 'Host: ' + user.first_name + '\n';
            message += 'Please add @ResistenceBot\n';
            message += 'use /join to enter';
            $.sendMessage(message);
          }
        });
      }
    });

    tg.for('/settings', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) throw err;
        $.sendMessage(JSON.stringify(group, null, 2));
      });
    });

    tg.for('/stop', function () {
      _Group2.default.remove({
        _id: chat.id
      }, function (err) {
        if (err) {
          return console.error(err);
        }
        $.sendMessage('<send match info here>');
      });
    });

    tg.for('/help', function () {
      _fs2.default.readFile(global.App.root + '/help.txt', function (err, data) {
        if (err) throw err;
        $.sendMessage(data.toString());
      });
    });
  };
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;