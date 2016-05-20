export default function (tg) {
  return function ($) {
    tg.for('/vote', () => {
      let user = $.user
      console.log(user)
      $.runMenu({
        message: 'Select:',
        layout: [1, 2],
        'Success ✅': () => {},
        'Failure ❌': () => {}
      })
    })
  }
};
