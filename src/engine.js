import _ from 'lodash'

const Engine = {
  generateRoles: (n) => {
    let totalResistence = Math.round(n * (3 / 4))
    let totalSpies = Math.round(n * (1 / 4))

    let resistence = _.times(totalResistence, _.constant('resistence'))
    let spies = _.times(totalSpies, _.constant('spy'))
    let roles = _.concat(resistence, spies)

    return _.shuffle(roles)
  }
}

export default Engine
