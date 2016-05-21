import _ from 'lodash'

// TODO Move to Redis
let VOTE_CACHE = {}

function generateRoles (n) {
  // Use a function that aproximates the original game role distribution
  function round (n) {
    if ((n % 1) >= 0.7) {
      return Math.ceil(n)
    }
    return Math.floor(n)
  }

  let totalSpies = round(n * (1))
  let spies = _.times(totalSpies, _.constant('spy'))
  let resistance = _.times(n - totalSpies, _.constant('resistance'))
  let roles = _.concat(resistance, spies)
  console.log(roles)
  return _.shuffle(roles)
}

function createPartitionRoles (users) {
  let partition = {
    all: [],
    spies: [],
    resistance: []
  }
  let roles = generateRoles(users.length)

  for (var i = 0; i < users.length; i++) {
    let user = {
      id: users[i].id,
      alias: users[i].alias,
      role: roles[i]
    }

    partition.all.push(user)

    if (user.role === 'spy') {
      partition.spies.push(user)
    } else {
      partition.resistance.push(user)
    }
  }
  return partition
}

function matchResults (group) {
  let w = group.score_resistance > group.score_spy ? 'Resistance' : 'Spies'
  let results = '🏁 Match Results 🏁\n\n'
  results += 'Spy Score: ' + group.score_spy + '\n'
  results += 'Resistance Score: ' + group.score_resistance + '\n'
  results += '\n and the winner is ...\n\n🏆 The ' + w
  return results
}

function canVote (userId) {
  return VOTE_CACHE[userId] === undefined
}

function cacheVote (userId) {
  VOTE_CACHE[userId] = true
}

function clearCache () {
  VOTE_CACHE = {}
}

export default {
  generateRoles,
  createPartitionRoles,
  matchResults,
  canVote,
  cacheVote,
  clearCache
}
