'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vote = require('./controllers/vote');

var _vote2 = _interopRequireDefault(_vote);

var _global = require('./controllers/global');

var _global2 = _interopRequireDefault(_global);

var _game = require('./controllers/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Register App globals
global.App = {
  root: _path2.default.resolve(__dirname, '..')
};

// Connect to db
_mongoose2.default.connect('mongodb://localhost/resistence_bot');
var db = _mongoose2.default.connection;

db.once('open', function () {
  console.log('Connected to resistence_bot db');

  var tg = require('telegram-node-bot')(process.env.RESISTENCE_BOT_TOKEN);

  tg.router.when(['/start', '/help', '/settings'], 'GlobalController').when(['/vote'], 'VoteController').when(['/new', '/join', '/stats', '/stop'], 'GameController');

  tg.controller('VoteController', (0, _vote2.default)(tg));
  tg.controller('GlobalController', (0, _global2.default)(tg));
  tg.controller('GameController', (0, _game2.default)(tg));
});