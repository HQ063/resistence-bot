'use strict';

var _vote = require('./controllers/vote');

var _vote2 = _interopRequireDefault(_vote);

var _global = require('./controllers/global');

var _global2 = _interopRequireDefault(_global);

var _game = require('./controllers/game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tg = require('telegram-node-bot')(process.env.RESISTENCE_BOT_TOKEN);
var mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/resistence_bot');
var db = mongoose.connection;

db.once('open', function () {
  console.log('Connected to resistence_bot db');

  tg.router.when(['/start', '/help', '/settings', '/stop'], 'GlobalController').when(['/vote'], 'VoteController').when(['/join', '/stats', '/begin'], 'GameController');

  tg.controller('VoteController', (0, _vote2.default)(tg));
  tg.controller('GlobalController', (0, _global2.default)(tg));
  tg.controller('GameController', (0, _game2.default)(tg));
});

// tg.controller('PingController', ($) => {
//   tg.for('gay', () => {
//     $.sendMessage('alexandre yoshinaga')
//   })
//   // tg.for('/vote :person', () => {
//   //   console.log($.query.person)
//   //   cache.push($.query.person);
//   //   $.sendMessage(cache.join(', '))
//   // });
//   tg.for('pm', () => {
//     tg.sendMessage(210991046, 'This is a private message');
//   })
//   tg.for('/vote', () => {
//     console.dir($)
//     let user = $.user
//
//     $.runMenu({
//         message: 'Select:',
//         layout: [1, 2],
//         'Success ✅': () => {},
//         'Failure ❌': () => {}
//     })
//   });
// })