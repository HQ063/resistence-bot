'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    var user = $.user;
    console.dir($);

    tg.for('/start', function () {
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
              $.sendMessage('Group already started!');
            } else {
              $.sendMessage('Groud id: ' + g);
            }
          }
          $.sendMessage('');
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
      var message = '';
      message += '🔻User\n';
      message += '> Name: ' + user.first_name + '\n';
      message += '> ID: ' + user.id + '\n';
      message += '🔻Bot\n';
      message += '> telegram.me/ResistenceBot\n';
      $.sendMessage(message);
    });
  };
};

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;