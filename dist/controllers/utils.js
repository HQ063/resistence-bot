'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sendTextFile($, file) {
  _fs2.default.readFile(global.App.root + '/docs/' + file, function (err, data) {
    if (err) throw err;
    $.sendMessage(data.toString());
  });
}

function zipWithIndex(arr) {
  var indexes = Object.keys(arr);

  return _lodash2.default.zip(indexes, arr);
}

function warn($, message) {
  $.sendMessage('⚠️ ' + message);
}

exports.default = {
  sendTextFile: sendTextFile,
  zipWithIndex: zipWithIndex,
  warn: warn
};