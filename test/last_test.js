'use strict'

const test = require('tape')
const scour = require('../index')

test('.last()', (t) => {
  t.deepEqual(scour([ 'a', 'b' ]).last().val(), 'b', 'for arrays')
  t.deepEqual(scour({0: 'a', 1: 'b'}).last().val(), 'b', 'for objects')
  t.deepEqual(scour([]).last().val(), undefined, 'for empty arrays')
  t.deepEqual(scour({}).last().val(), undefined, 'for empty objects')
  t.end()
})
