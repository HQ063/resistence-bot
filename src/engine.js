import _ from 'lodash'

// TODO Move to Redis
let VOTE_CACHE = {}

const Engine = {
  generateRoles: (n) => {
    let totalResistence = Math.round(n * (3 / 4))
    let totalSpies = Math.round(n * (1 / 4))

    let resistence = _.times(totalResistence, _.constant('resistence'))
    let spies = _.times(totalSpies, _.constant('spy'))
    let roles = _.concat(resistence, spies)

    return _.shuffle(roles)
  },
  matchResults: (group) => {
    let w = group.score_resistance > group.score_spy ? 'Resistance' : 'Spies'
    let results = '🏁 Match Results 🏁\n\n'
    results += 'Spy Score: ' + group.score_spy + '\n'
    results += 'Resistance Score: ' + group.score_resistance + '\n'
    results += '\n and the winner is ...\n\n🏆 The ' + w
    return results
  },
  canVote: (userId) => {
    return VOTE_CACHE[userId] === undefined
  },
  cacheVote: (userId) => {
    VOTE_CACHE[userId] = true
  },
  clearCache: () => {
    VOTE_CACHE = {}
  }
}

export default Engine
