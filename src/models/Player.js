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

export default mongoose.model('Player', playerSchema)
