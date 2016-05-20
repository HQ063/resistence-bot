import Group from '../models/Group'
import Player from '../models/Player'
import _ from 'lodash'
import Engine from '../engine'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    let user = $.user

    tg.for('/join', () => {
      Group.findOne({
        _id: chat.id
      }, (err, group) => {
        if (err) {
          return console.error(err)
        }

        if (!group) {
          return console.log(`Group not found ${chat.id}`)
        }

        if (_.includes(group.users, user.id)) {
          console.log(`User already joined: ${user.id}`)
        } else {
          group.users = group.users || []
          group.users.push(user.id)

          group.save((err) => {
            if (err) {
              return console.error(err)
            }

            let player = new Player({
              _id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              group: {
                id: group.id,
                name: group.name
              }
            })

            player.save((err) => {
              if (err) {
                return console.error(err)
              }
              $.sendMessage(`User ${user.first_name} has joined`)
            })
          })
        }
      })
    })

    tg.for('/stats', () => {
      Group.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err)
        }
        $.sendMessage('' +
          'total players: ' + group.users.length + '\n' +
          'users: [' + group.users.join(', ') + ']'
        )
      })
    })

    tg.for('/start', () => {
      Group.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err)
        }

        let roles = Engine.generateRoles(group.users.length)
        console.log(roles)

        let zipped = _.zip(group.users, roles)
        let spyGroup = _.groupBy(zipped, (z) => {
          return z[1]
        })
        console.log(spyGroup)
        zipped.forEach((z) => {
          Player.findOneAndUpdate({
            _id: z[0]
          }, {
            'group.role': z[1]
          }, {}, (err, player) => {
            if (err) {
              console.error(err)
            }
            if (!player) {
              return
            }
            console.log(player)
            if (player.group.role === 'spy') {
              // Tell the player who are the spies
              tg.sendMessage(player._id, 'Spies are ')
            } else {
              tg.sendMessage(player._id, 'Your role is: resistence')
            }
          })
        })
      })
    })
  }
};
