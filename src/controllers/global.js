import utils from './utils'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    // let user = $.user

    tg.for('/start', () => {
      if (chat.type === 'private') {
        utils.sendTextFile($, 'private-help.txt')
      }
    })

    tg.for('/settings', () => {
      // TODO Not implemented yet
    })

    tg.for('/help', () => {
      utils.sendTextFile($, 'group-help.txt')
    })

    tg.for('/rules', () => {
      utils.sendTextFile($, 'rules.txt')
    })
  }
};
