'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _global = require('./controllers/global');

var _global2 = _interopRequireDefault(_global);

var _group = require('./controllers/group');

var _group2 = _interopRequireDefault(_group);

var _player = require('./controllers/player');

var _player2 = _interopRequireDefault(_player);

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

  tg.router.when(['/start', '/help', '/settings', '/rules'], 'GlobalController').when(['/vote', '/me'], 'PlayerController').when(['/new', '/join', '/begin', '/stop', '/stats', '/mission', '/turn', '/launch'], 'GroupController');

  tg.controller('GlobalController', (0, _global2.default)(tg));
  tg.controller('PlayerController', (0, _player2.default)(tg));
  tg.controller('GroupController', (0, _group2.default)(tg));
});