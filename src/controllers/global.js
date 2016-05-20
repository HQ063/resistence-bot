import fs from 'fs'
import Group from '../models/Group'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    let user = $.user
    console.dir($)

    tg.for('/start', () => {
      if (chat && chat.type === 'group') {
        let group = new Group({
          _id: chat.id,
          name: chat.title,
          host: $.user // host starts the match
        })
        group.save((err, g) => {
          if (err) {
            console.error(err)
            if (err.code === 11000) {
              $.sendMessage('Ops! A Match has already been started.')
            }
          } else {
            let message = ''
            message += '🎲 The Match has started 🎲\n🏁\n'
            message += `Host: ${user.first_name}\n`
            message += 'Please add @ResistenceBot\n'
            message += 'use /join to enter'
            $.sendMessage(message)
          }
        })
      }
    })

    tg.for('/settings', () => {
      Group.findOne({
        _id: chat.id
      }, (err, group) => {
        if (err) throw err
        $.sendMessage(JSON.stringify(group, null, 2))
      })
    })

    tg.for('/stop', () => {
      Group.remove({
        _id: chat.id
      }, (err) => {
        if (err) {
          return console.error(err)
        }
        $.sendMessage('<send match info here>')
      })
    })

    tg.for('/help', () => {
      fs.readFile(global.App.root + '/help.txt', (err, data) => {
        if (err) throw err
        $.sendMessage(data.toString())
      })
    })
  }
};
