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

        if (_lodash2.default.includes(group.users, user.id)) {
          console.log('User already joined: ' + user.id);
        } else {
          group.users = group.users || [];
          group.users.push(user.id);

          group.save(function (err) {
            if (err) {
              return console.error(err);
            }

            var player = new _Player2.default({
              _id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              group: {
                id: group.id,
                name: group.name
              }
            });

            player.save(function (err) {
              if (err) {
                return console.error(err);
              }
              $.sendMessage('User ' + user.first_name + ' has joined');
            });
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

    tg.for('/start', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          return $.sendMessage('Create the game first /new');
        }

        var roles = _engine2.default.generateRoles(group.users.length);
        console.log(roles);

        var zipped = _lodash2.default.zip(group.users, roles);
        var spyGroup = _lodash2.default.groupBy(zipped, function (z) {
          return z[1];
        });
        console.log(spyGroup);
        zipped.forEach(function (z) {
          _Player2.default.findOneAndUpdate({
            _id: z[0]
          }, {
            'group.role': z[1]
          }, {}, function (err, player) {
            if (err) {
              console.error(err);
            }
            if (!player) {
              return;
            }
            console.log(player);
            if (player.group.role === 'spy') {
              // Tell the player who are the spies
              tg.sendMessage(player._id, 'Spies are ');
            } else {
              tg.sendMessage(player._id, 'Your role is: resistence');
            }
          });
        });
      });
    });
  };
};

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

var _Player = require('../models/Player');

var _Player2 = _interopRequireDefault(_Player);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _engine = require('../engine');

var _engine2 = _interopRequireDefault(_engine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;