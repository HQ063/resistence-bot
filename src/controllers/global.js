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

    tg.for('/help', () => {
      if (chat.type === 'group') {
        utils.sendTextFile($, 'group-help.txt')
      } else {
        utils.sendTextFile($, 'private-help.txt')
      }
    })

    tg.for('/rules', () => {
      utils.sendTextFile($, 'rules.txt')
    })

    tg.for('/team', () => {
      utils.sendTextFile($, 'team.txt')
    })

    // tg.for('/settings', () => {
    //   // TODO Not implemented yet
    // })
  }
};
