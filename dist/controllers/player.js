'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var chat = $.message.chat;
    var user = $.user;

    if (chat.type !== 'private') {
      return;
    }

    function handleVote(vote) {
      _Group2.default.findOne({
        'users.id': user.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          return console.log('Group not found:', user.id);
        }

        var playerIds = group.mission.players.map(function (player) {
          return player.id;
        });

        if (_lodash2.default.includes(playerIds, user.id)) {
          group.mission.votes = group.mission.votes || [];
          group.mission.votes.push(vote);
          var votes = group.mission.votes;

          // Everyone has voted
          if (votes.length === group.mission.players.length) {
            var winner = void 0;
            var approved = count(votes, function (v) {
              return v === true;
            });
            var sabotage = count(votes, function (v) {
              return v === false;
            });

            if (sabotage >= 1) {
              winner = 'Spies';
              group.score_spy += 1;
            } else {
              winner = 'Resistance';
              group.score_resistance += 1;
            }

            var message = 'Mission Results:';
            message += '\nApproved: ' + approved;
            message += '\nSabotage: ' + sabotage;
            message += '\n\n The ' + winner + ' won this match';
            tg.sendMessage(group.id, message);
            _engine2.default.clearCache();
          }

          group.save(function (err) {
            if (err) {
              return console.error(err);
            }
            _engine2.default.cacheVote(user.id);
            tg.sendMessage(group.id, user.first_name + ' has voted!');
          });
        } else {
          console.log('User ' + user.id + ' tryied to vote');
        }
      });
    }

    tg.for('/vote', function () {
      if (_engine2.default.canVote(user.id)) {
        $.runMenu({
          message: 'Select:',
          layout: [1, 2],
          'Approve ✅': function Approve() {
            handleVote(true);
          },
          'Sabotage 💣': function Sabotage() {
            handleVote(false);
          }
        });
      } else {
        console.log('User already voted', user.id);
      }
    });
  };
};

var _Group = require('../models/Group');

var _Group2 = _interopRequireDefault(_Group);

var _engine = require('../engine');

var _engine2 = _interopRequireDefault(_engine);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function count(arr, pred) {
  return arr.filter(pred).length;
}

;