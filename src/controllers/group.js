import Group from '../models/Group'
import Player from '../models/Player'
import _ from 'lodash'
import Engine from '../engine'
import utils from './utils'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    let user = $.user

    if (chat.type !== 'group') {
      return
    }

    tg.for('/new', () => {
      let group = new Group({
        _id: chat.id,
        name: chat.title,
        host: $.user // host starts the match
      })
      group.save((err, g) => {
        if (err) {
          console.error(err)
          if (err.code === 11000) {
            $.sendMessage('Ops! A Match has already been started.')
          }
        } else {
          let message = ''
          message += '🎲 The Match has started 🎲\n🏁\n'
          message += `Host: ${user.first_name}\n`
          message += 'Please add @ResistenceBot\n'
          message += 'use /join to enter'
          $.sendMessage(message)
        }
      })
    })

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

            Player.update({
              _id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              group: {
                id: group.id,
                name: group.name
              }
            }, {
              upsert: true
            },
            (err) => {
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
        if (!group) {
          console.log('Group not found:', chat.id)
          return
        }

        let message = ''
        message += 'Players:\n'
        utils.zipWithIndex(group.users).forEach((tuple) => {
          message += `${tuple[0]}) ${tuple[1]}\n`
        })
        $.sendMessage(message)
      })
    })

    tg.for('/begin', () => {
      Group.findOne({
        _id: chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err)
        }

        if (!group) {
          return $.sendMessage('Create the game first /new')
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
              tg.sendMessage(player._id, 'Your role is: resistance')
            }
          })
        })
      })
    })

    tg.for('/stop', () => {
      Group.findOne({
        _id: chat.id,
        'host.id': user.id // only the host may stop
      }, (err, group) => {
        if (err) {
          return console.error(err)
        }
        if (!group) {
          console.log(`Group ${chat.id} not found or ${user.id} is not the host`)
          return
        }
        group.remove()
        let results = Engine.matchResults(group)
        $.sendMessage(results)
      })
    })

    tg.for('/mission', () => {
      var players = _.compact($.args.split(' '))

      if (players.length === 0) {
        $.sendMessage('Ops! You need to inform at least on player to send.')
        return
      }
      Group.mission(chat.id, players, (err) => {
        if (err) {
          return console.error(err)
        }
        $.sendMessage('Mission launched 🚀\n\n' +
            players.join('\n') + '\n' +
            'Waiting for players to vote...')
      })
    })
  }
};
