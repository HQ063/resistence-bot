import fs from 'fs'

function sendTextFile ($, file) {
  fs.readFile(global.App.root + '/' + file, (err, data) => {
    if (err) throw err
    $.sendMessage(data.toString())
  })
}

export default {
  sendTextFile
}
