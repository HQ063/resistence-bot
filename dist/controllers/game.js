'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    var user = $.user;

    tg.for('/join', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          return console.log('Group not found ' + chat.id);
        }
        console.log(group);
        if (_lodash2.default.includes(group.users, user.id)) {
          console.log('User already joined: ' + user.id);
        } else {
          group.users = group.users || [];
          group.users.push(user.id);
          group.save(function (err) {
            if (err) {
              return console.error(err);
            }
            $.sendMessage('User ' + user.first_name + ' has joined');
          });
        }
      });
    });

    tg.for('/stats', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }
        $.sendMessage('' + 'total players: ' + group.users.length + '\n' + 'users: [' + group.users.join(', ') + ']');
      });
    });

    tg.for('/begin', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        var roles = _engine2.default.generateRoles(group.users.length);
        console.log(roles);

        _lodash2.default.zip(group.users, roles).forEach(function (zip) {
          console.log(zip[0], zip[1]);

          tg.sendMessage(zip[0], 'Your role is: ' + zip[1]);
        });
      });
    });
  };
};

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _engine = require('../engine');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;