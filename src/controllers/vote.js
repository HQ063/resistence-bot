export default function (tg) {
  return function ($) {
    let user = $.user
    let chat = $.message.chat

    if (chat.type !== 'private') {
      return
    }

    tg.for('/vote', () => {
      $.runMenu({
        message: 'Select:',
        layout: [1, 2],
        'Success ✅': () => {
          console.log('sucesso')
        },
        'Failure ❌': () => {
          console.log('error')
        }
      })
    })
  }
};
