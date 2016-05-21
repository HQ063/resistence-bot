import mongoose from 'mongoose'
import utils from '../controllers/utils'
import _ from 'lodash'

let groupSchema = mongoose.Schema({
  _id: Number,
  name: String,
  host: Object,
  users: Array,
  score_spy: {
    type: Number,
    default: 0
  },
  score_resistance: {
    type: Number,
    default: 0
  },
  mission: {
    players: Array,
    votes: Array
  }
}, {
  timestamps: true
})

groupSchema.statics.mission = function mission (_id, players, callback) {
  return this.findOne({
    _id: _id
  }, (err, group) => {
    if (err) {
      return callback(err)
    }

    if (!group) {
      console.log('Group not found:', _id)
      return
    }

    let usersId = utils.zipWithIndex(group.users).filter((tuple) => {
      return _.includes(players, tuple[0])
    }).map((tuple) => {
      return tuple[1]
    })

    this.update({
      _id: _id
    }, {
      $set: {
        mission: {
          players: usersId
        }
      }
    }, (err) => {
      if (err) {
        return callback(err)
      }
      callback(null, group.users)
    })
  })
}

export default mongoose.model('Group', groupSchema)
