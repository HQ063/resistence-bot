import VoteController from './controllers/vote'
import GlobalController from './controllers/global'
import GameController from './controllers/game'


const tg = require('telegram-node-bot')(process.env.RESISTENCE_BOT_TOKEN)
const mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost/resistence_bot');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to resistence_bot db');

  tg.router
    .when(['/start', '/help', '/settings', '/stop'], 'GlobalController')
    .when(['/vote'], 'VoteController')
    .when(['/join', '/stats', '/begin'], 'GameController')

  tg.controller('VoteController', VoteController(tg));
  tg.controller('GlobalController', GlobalController(tg));
  tg.controller('GameController', GameController(tg));
})


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
