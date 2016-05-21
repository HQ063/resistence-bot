(function () {
  'use strict'

  const Engine = require('../../dist/engine').default
  const assert = require('chai').assert

  function countUserRoles (users, role) {
    let roles = users.map((user) => {
      return user.role
    })
    return countRoles(roles, role)
  }

  function countRoles (roles, role) {
    return roles.filter((r) => {
      return r === role
    }).length
  }

  describe('Resistance Bot Engine', () => {
    describe('generateRoles', () => {
      it('should generate correct roles for 5 players', () => {
        let roles = Engine.generateRoles(5)
        assert.equal(countRoles(roles, 'spy'), 2)
        assert.equal(countRoles(roles, 'resistance'), 3)
      })

      it('should generate correct roles for 6 players', () => {
        let roles = Engine.generateRoles(6)
        assert.equal(countRoles(roles, 'spy'), 2)
        assert.equal(countRoles(roles, 'resistance'), 4)
      })

      it('should generate correct roles for 7 players', () => {
        let roles = Engine.generateRoles(7)
        assert.equal(countRoles(roles, 'spy'), 3)
        assert.equal(countRoles(roles, 'resistance'), 4)
      })

      it('should generate correct roles for 8 players', () => {
        let roles = Engine.generateRoles(8)
        assert.equal(countRoles(roles, 'spy'), 3)
        assert.equal(countRoles(roles, 'resistance'), 5)
      })

      it('should generate correct roles for 9 players', () => {
        let roles = Engine.generateRoles(9)
        assert.equal(countRoles(roles, 'spy'), 3)
        assert.equal(countRoles(roles, 'resistance'), 6)
      })

      it('should generate correct roles for 10 players', () => {
        let roles = Engine.generateRoles(10)
        assert.equal(countRoles(roles, 'spy'), 4)
        assert.equal(countRoles(roles, 'resistance'), 6)
      })
    })
    describe('createPartitionRoles', () => {
      let users = []

      before(() => {
        users.push({id: 1})
        users.push({id: 2})
        users.push({id: 3})
        users.push({id: 4})
        users.push({id: 5})
      })

      it('should create a partition for 5 users', () => {
        let partition = Engine.createPartitionRoles(users)
        assert.equal(partition.all.length, 5)
        assert.equal(partition.spies.length, 2)
        assert.equal(partition.resistance.length, 3)
      })

      it('should correcly set the user role', () => {
        let partition = Engine.createPartitionRoles(users)
        assert.equal(partition.spies[0].role, 'spy')
        assert.equal(partition.resistance[0].role, 'resistance')
      })

      it('should correcly split the roles in the partition', () => {
        let partition = Engine.createPartitionRoles(users)
        assert.equal(countUserRoles(partition.spies, 'spy'), 2)
        assert.equal(countUserRoles(partition.resistance, 'resistance'), 3)
      })
    })
  })
})()
