'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO Move to Redis
var VOTE_CACHE = {};

function generateRoles(n) {
  // Use a function that aproximates the original game role distribution
  function round(n) {
    if (n % 1 >= 0.7) {
      return Math.ceil(n);
    }
    return Math.floor(n);
  }

  var totalSpies = round(n * (2 / 5));
  var spies = _lodash2.default.times(totalSpies, _lodash2.default.constant('spy'));
  var resistance = _lodash2.default.times(n - totalSpies, _lodash2.default.constant('resistance'));
  var roles = _lodash2.default.concat(resistance, spies);
  return _lodash2.default.shuffle(roles);
}

function createPartitionRoles(users) {
  var partition = {
    all: [],
    spies: [],
    resistance: []
  };
  var roles = generateRoles(users.length);

  for (var i = 0; i < users.length; i++) {
    var user = {
      id: users[i].id,
      alias: users[i].alias,
      role: roles[i]
    };

    partition.all.push(user);

    if (user.role === 'spy') {
      partition.spies.push(user);
    } else {
      partition.resistance.push(user);
    }
  }
  return partition;
}

function matchResults(group) {
  var w = group.score_resistance > group.score_spy ? 'Resistance' : 'Spies';
  var results = '🏁 Match Results 🏁\n\n';
  results += 'Spy Score: ' + group.score_spy + '\n';
  results += 'Resistance Score: ' + group.score_resistance + '\n';
  results += '\n and the winner is ...\n\n🏆 The ' + w;
  return results;
}

function canVote(userId) {
  return VOTE_CACHE[userId] === undefined;
}

function cacheVote(userId) {
  VOTE_CACHE[userId] = true;
}

function clearCache() {
  VOTE_CACHE = {};
}

exports.default = {
  generateRoles: generateRoles,
  createPartitionRoles: createPartitionRoles,
  matchResults: matchResults,
  canVote: canVote,
  cacheVote: cacheVote,
  clearCache: clearCache
};