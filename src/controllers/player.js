import Group from '../models/Group'
import Engine from '../engine'
import _ from 'lodash'

function count (arr, pred) {
  return arr.filter(pred).length
}

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
          let votes = group.mission.votes

          // Everyone has voted
          if (votes.length === group.mission.players.length) {
            let winner
            let approved = count(votes, (v) => {
              return v === true
            })
            let sabotage = count(votes, (v) => {
              return v === false
            })

            if (sabotage >= 1) {
              winner = 'Spies'
              group.score_spy += 1
            } else {
              winner = 'Resistence'
              group.score_resistance += 1
            }

            let message = 'Mission Results:'
            message += '\nApproved: ' + approved
            message += '\nSabotage: ' + sabotage
            message += '\n\n The ' + winner + ' won this match'
            tg.sendMessage(group.id, message)
            Engine.clearCache()
          }

          group.save((err) => {
            if (err) {
              return console.error(err)
            }
            tg.sendMessage(group.id, `${user.first_name} has voted!`)
          })
        } else {
          console.log(`User ${user.id} tryied to vote`)
        }
      })
    }

    tg.for('/vote', () => {
      if (Engine.canVote(user.id)) {
        Engine.cacheVote(user.id)
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
