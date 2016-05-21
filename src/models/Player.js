const mongoose = require('mongoose')

let playerSchema = mongoose.Schema({
  _id: Number,
  first_name: String,
  last_name: String,
  group: {
    id: Number,
    name: String,
    role: String
  }
}, {
  timestamps: true
})

playerSchema.statics.getByIds = function getByIds (ids, callback) {
  return this.find({
    _id: {
      $in: ids
    }
  }, (err, players) => {
    callback(err, players)
  })
}

playerSchema.methods.joinMatch = function joinMatch (newPlayer, callback) {
  return this.model('Player').findOne({
    _id: newPlayer._id
  }, (err, player) => {
    if (err) {
      return console.error(err)
    }
    if (!player) {
      newPlayer.save((err) => {
        callback(err)
      })
    }
  })
}

export default mongoose.model('Player', playerSchema)
