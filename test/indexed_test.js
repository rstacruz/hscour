'use strict'

var test = require('tape')
var scour = require('../index')
var indexed = require('../extensions/indexed')

test('indexed', t => {
  var _scour = indexed(scour, { users: 'name' })

  var data = _scour({
    users:
      { 1: { name: 'john', last: 'digweed' },
        2: { name: 'max', last: 'graham' },
        3: { name: 'sasha', last: 'cox' } } })

  data.filter({ name: 'john' })

  t.end()
})

