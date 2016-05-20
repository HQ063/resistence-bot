import mongoose from 'mongoose'
import path from 'path'
import VoteController from './controllers/vote'
import GlobalController from './controllers/global'
import GameController from './controllers/game'

// Register App globals
global.App = {
  root: path.resolve(__dirname, '..')
}

// Connect to db
mongoose.connect('mongodb://localhost/resistence_bot')
const db = mongoose.connection

db.once('open', () => {
  console.log('Connected to resistence_bot db')

  const tg = require('telegram-node-bot')(process.env.RESISTENCE_BOT_TOKEN)

  tg.router
    .when(['/start', '/help', '/settings', '/stop'], 'GlobalController')
    .when(['/vote'], 'VoteController')
    .when(['/join', '/stats', '/begin'], 'GameController')

  tg.controller('VoteController', VoteController(tg))
  tg.controller('GlobalController', GlobalController(tg))
  tg.controller('GameController', GameController(tg))
})
