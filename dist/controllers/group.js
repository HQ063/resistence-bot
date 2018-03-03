'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    var user = $.user;

    if (chat.type !== 'group') {
      return;
    }

    tg.for('/new', function () {
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
          message += '🎲 The Match has started 🎲\n\n';
          message += 'Host: ' + user.first_name + '\n';
          message += 'Please add @ResistenceBot\n';
          message += 'use /join to enter';
          $.sendMessage(message);
        }
      });
    });

    tg.for('/join', function () {
      _Group2.default.findOne({
        _id: chat.id,
        'users.id': {
          '$ne': user.id // don't allow the user to join twice
        }
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          return console.log('Group not found ' + chat.id);
        }

        group.users = group.users || [];
        group.users.push({
          id: user.id,
          alias: user.first_name + '_' + user.last_name
        });

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

          player.joinMatch(player, function (err) {
            if (err) {
              return console.error(err);
            }
            $.sendMessage('User ' + user.first_name + ' has joined');
          });
        });
      });
    });

    tg.for('/stats', function () {
      _Group2.default.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }
        if (!group) {
          console.log('Group not found:', chat.id);
          return;
        }

        var aliases = group.users.map(function (user) {
          return user.alias;
        });

        var message = '';
        message += 'Players:\n';
        _utils2.default.zipWithIndex(aliases).forEach(function (tuple) {
          message += tuple[0] + ') ' + tuple[1] + '\n';
        });
        $.sendMessage(message);
      });
    });

    tg.for('/begin', function () {
      _Group2.default.findOne({
        _id: chat.id,
        'host.id': user.id // only the host may stop
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          _utils2.default.warn($, 'Create the game first /new');
          return;
        }

        if (group.users.length < 5) {
          _utils2.default.warn($, 'At least five players is required to begin');
          return;
        }

        var partition = _engine2.default.createPartitionRoles(group.users);

        partition.all.forEach(function (user) {
          _Player2.default.findOneAndUpdate({
            _id: user.id
          }, {
            'group.role': user.role
          }, {}, function (err, player) {
            if (err) {
              console.error(err);
            }
            if (!player) {
              return;
            }

            if (player.group.role === 'spy') {
              // Tell the player who are the spies
              tg.sendMessage(player._id, 'You are a Spy 😎\n\n' + '📝 Spy List:' + partition.spies.map(function (spy) {
                return '\n∙ ' + spy.alias;
              }));
            } else {
              tg.sendMessage(player._id, 'You are from the Resistance 🕵');
            }
          });
        });
      });
    });

    tg.for('/stop', function () {
      _Group2.default.findOne({
        _id: chat.id,
        'host.id': user.id // only the host may stop
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }
        if (!group) {
          console.log('Group ' + chat.id + ' not found or ' + user.id + ' is not the host');
          return;
        }
        group.remove();
        var results = _engine2.default.matchResults(group);
        $.sendMessage(results);
      });
    });

    tg.for('/mission', function () {
      var players = _lodash2.default.compact($.args.split(' '));

      if (players.length === 0) {
        $.sendMessage('Ops! You need to inform at least on player to send.');
        return;
      }

      _Group2.default.mission(chat.id, players, function (err, users) {
        if (err) {
          return console.error(err);
        }

        var names = users.map(function (user) {
          return user.name;
        });

        $.sendMessage('🚀Mission launched 🚀\n\n' + names.join('\n') + '\n\n' + 'Waiting for players to vote.. 💤');
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

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;