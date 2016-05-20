(function () {
  'use strict'

  const Engine = require('../../dist/engine').default
  const assert = require('chai').assert

  describe('Resistance Bot Engine', () => {
    describe('generateRoles', () => {
      function filterRoles (roles, role) {
        return roles.filter((r) => {
          return r === role
        }).length
      }

      it('should generate correct roles for 5 players', () => {
        let roles = Engine.generateRoles(5)
        assert.equal(filterRoles(roles, 'spy'), 2)
        assert.equal(filterRoles(roles, 'resistance'), 3)
      })

      it('should generate correct roles for 6 players', () => {
        let roles = Engine.generateRoles(6)
        assert.equal(filterRoles(roles, 'spy'), 2)
        assert.equal(filterRoles(roles, 'resistance'), 4)
      })

      it('should generate correct roles for 7 players', () => {
        let roles = Engine.generateRoles(7)
        assert.equal(filterRoles(roles, 'spy'), 3)
        assert.equal(filterRoles(roles, 'resistance'), 4)
      })

      it('should generate correct roles for 8 players', () => {
        let roles = Engine.generateRoles(8)
        assert.equal(filterRoles(roles, 'spy'), 3)
        assert.equal(filterRoles(roles, 'resistance'), 5)
      })

      it('should generate correct roles for 9 players', () => {
        let roles = Engine.generateRoles(9)
        assert.equal(filterRoles(roles, 'spy'), 3)
        assert.equal(filterRoles(roles, 'resistance'), 6)
      })

      it('should generate correct roles for 10 players', () => {
        let roles = Engine.generateRoles(10)
        assert.equal(filterRoles(roles, 'spy'), 4)
        assert.equal(filterRoles(roles, 'resistance'), 6)
      })
    })
  })
})()
