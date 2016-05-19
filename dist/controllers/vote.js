'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tg) {
  return function ($) {
    tg.for('/vote', function () {
      var user = $.user;
      console.log(user);
      $.runMenu({
        message: 'Select:',
        layout: [1, 2],
        'Success ✅': function Success() {},
        'Failure ❌': function Failure() {}
      });
    });
  };
};

;