import Group from '../models/Group'
import _ from 'lodash'
import Engine from '../engine'

export default function (tg) {
  return function ($) {
    let chat = $.message.chat
    let user = $.user

    tg.for('/join', () => {
      Group.findOne({
        _id : chat.id
      }, (err, group) => {
        if (err) {
          return console.error(err);
        }

        if (!group) {
          return console.log(`Group not found ${chat.id}`)
        }
        console.log(group)
        if (_.includes(group.users, user.id)) {
          console.log(`User already joined: ${user.id}`)
        } else {
          group.users = group.users || [];
          group.users.push(user.id);
          group.save((err) => {
            if (err) {
              return console.error(err)
            }
            $.sendMessage(`User ${user.first_name} has joined`)
          });
        }
      });
    })

    tg.for('/stats', () => {
      Group.findOne({
        _id : chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err);
        }
        $.sendMessage(''
          + 'total players: ' + group.users.length + '\n'
          + 'users: [' + group.users.join(', ') + ']'
        )
      })
    })

    tg.for('/begin', () => {
      Group.findOne({
        _id : chat.id
      }, function (err, group) {
        if (err) {
          return console.error(err)
        }


        let roles = Engine.generateRoles(group.users.length);
        console.log(roles)

        _.zip(group.users, roles).forEach((zip) => {
          console.log(zip[0], zip[1])

          tg.sendMessage(zip[0], 'Your role is: ' + zip[1])
        });
      })
    })

  };
};
