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

export default mongoose.model('Player', playerSchema)
