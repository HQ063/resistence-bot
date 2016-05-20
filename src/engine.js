import _ from 'lodash'

// TODO Move to Redis
let VOTE_CACHE = {}

const Engine = {
  generateRoles: (n) => {
    // Use a function that aproximates the original game role distribution
    function round (n) {
      if ((n % 1) >= 0.7) {
        return Math.ceil(n)
      }
      return Math.floor(n)
    }

    let totalSpies = round(n * (2 / 5))
    let spies = _.times(totalSpies, _.constant('spy'))
    let resistance = _.times(n - totalSpies, _.constant('resistance'))
    let roles = _.concat(resistance, spies)
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
