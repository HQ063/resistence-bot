'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    var user = $.user;
    var chat = $.message.chat;

    if (chat.type !== 'private') {
      return;
    }

    tg.for('/vote', function () {
      $.runMenu({
        message: 'Select:',
        layout: [1, 2],
        'Success ✅': function Success() {
          console.log('sucesso');
        },
        'Failure ❌': function Failure() {
          console.log('error');
        }
      });
    });
  };
};

;