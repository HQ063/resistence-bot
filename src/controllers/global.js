import utils from './utils'
import Group from '../models/Group'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    // let user = $.user

    tg.for('/start', () => {
      utils.sendTextFile($, 'private-help.txt')
    })

    tg.for('/settings', () => {
      Group.findOne({
        _id: chat.id
      }, (err, group) => {
        if (err) throw err
        $.sendMessage(JSON.stringify(group, null, 2))
      })
    })

    tg.for('/help', () => {
      utils.sendTextFile($, 'group-help.txt')
    })

    tg.for('/rules', () => {
      utils.sendTextFile($, 'rules.txt')
    })
  }
};
