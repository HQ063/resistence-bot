import mongoose from 'mongoose'
import path from 'path'
import GlobalController from './controllers/global'
import GroupController from './controllers/group'
import PlayerController from './controllers/player'

// Register App globals
global.App = {
  root: path.resolve(__dirname, '..')
}

// Connect to db
mongoose.connect('mongodb://dbuser:password@ds255308.mlab.com:55308/resistence-tg-bot')
const db = mongoose.connection

db.once('open', () => {
  console.log('Connected to resistence_bot db')

  const tg = require('telegram-node-bot')(process.env.RESISTENCE_BOT_TOKEN)
console.log(process.env.RESISTENCE_BOT_TOKEN);
  tg.router
    .when(['/start', '/help', '/settings', '/rules', '/team'], 'GlobalController')
    .when(['/vote', '/me'], 'PlayerController')
    .when(['/new', '/join', '/begin', '/stop', '/stats', '/mission'], 'GroupController')

  tg.controller('GlobalController', GlobalController(tg))
  tg.controller('PlayerController', PlayerController(tg))
  tg.controller('GroupController', GroupController(tg))
})
