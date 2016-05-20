import Group from '../models/Group'
import Engine from '../engine'
import _ from 'lodash'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    let user = $.user

    if (chat.type !== 'private') {
      return
    }

    function handleVote (vote) {
      Group.findOne({
        'users': user.id
      }, (err, group) => {
        if (err) {
          return console.error(err)
        }
        if (!group) {
          return console.log('Group not found:', user.id)
        }
        if (_.includes(group.mission.players, user.id)) {
          group.mission.votes = group.mission.votes || []
          group.mission.votes.push(vote)

          console.dir(group)
          group.save((err) => {
            console.log('AQUI')
            if (err) {
              return console.error(err)
            }
            Engine.cacheVote(user.id)
            tg.sendMessage(group.id, `${user.first_name} has voted!`)
          })
        } else {
          console.log(`User ${user.id} tryied to vote`)
        }
      })
    }

    tg.for('/vote', () => {
      if (Engine.canVote(user.id)) {
        $.runMenu({
          message: 'Select:',
          layout: [1, 2],
          'Approve ✅': () => {
            handleVote(true)
          },
          'Sabotage 💣': () => {
            handleVote(false)
          }
        })
      } else {
        console.log('User already voted', user.id)
      }
    })
  }
};
