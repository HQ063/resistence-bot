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
          message += '🎲 The Match has started 🎲\n\n'
          message += `Host: ${user.first_name}\n`
          message += 'Please add @ResistenceBot\n'
          message += 'use /join to enter'
          $.sendMessage(message)
        }
      })
    })

    tg.for('/join', () => {
      Group.findOne({
        _id: chat.id,
        'users.id': {
          '$ne': user.id // don't allow the user to join twice
        }
      }, (err, group) => {
        if (err) {
          return console.error(err)
        }

        if (!group) {
          return console.log(`Group not found ${chat.id}`)
        }

        group.users = group.users || []
        group.users.push({
          id: user.id,
          alias: user.first_name + '_' + user.last_name
        })

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

        let aliases = group.users.map((user) => {
          return user.alias
        })

        let message = ''
        message += 'Players:\n'
        utils.zipWithIndex(aliases).forEach((tuple) => {
          message += `${tuple[0]}) ${tuple[1]}\n`
        })
        $.sendMessage(message)
      })
    })

    tg.for('/begin', () => {
      Group.findOne({
        _id: chat.id,
        'host.id': user.id // only the host may stop
      }, function (err, group) {
        if (err) {
          return console.error(err)
        }

        if (!group) {
          utils.warn($, 'Create the game first /new')
          return
        }

        if (group.users.length < 5) {
          utils.warn($, 'At least five players is required to begin')
          return
        }

        let partition = Engine.createPartitionRoles(group.users)

        partition.all.forEach((user) => {
          Player.findOneAndUpdate({
            _id: user.id
          }, {
            'group.role': user.role
          }, {}, (err, player) => {
            if (err) {
              console.error(err)
            }
            if (!player) {
              return
            }

            if (player.group.role === 'spy') {
              // Tell the player who are the spies
              tg.sendMessage(player._id, 'You are a Spy 😎\n\n' +
                '📝 Spy List:' + partition.spies.map((spy) => {
                  return '\n∙ ' + spy.alias
                }))
            } else {
              tg.sendMessage(player._id, 'You are from the Resistance 🕵')
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
        $.sendMessage('🚀Mission launched 🚀\n\n' +
            players.join('\n') + '\n' +
            'Waiting for players to vote...')
      })
    })
  }
};
