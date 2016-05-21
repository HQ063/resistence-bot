import fs from 'fs'
import _ from 'lodash'

function sendTextFile ($, file) {
  fs.readFile(global.App.root + '/' + file, (err, data) => {
    if (err) throw err
    $.sendMessage(data.toString())
  })
}

function zipWithIndex (arr) {
  let indexes = Object.keys(arr)

  return _.zip(indexes, arr)
}

function warn ($, message) {
  $.sendMessage('⚠️ ' + message)
}

export default {
  sendTextFile,
  zipWithIndex,
  warn
}
