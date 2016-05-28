'use strict'

const test = require('tape')
const scour = require('../index')

var data

test('.first()', (t) => {
  data = [ 'a', 'b' ]
  t.deepEqual(
    scour(data).first().val(), 'a')

  data = { 0: 'a', 1: 'b' }
  t.deepEqual(
    scour(data).first().val(), 'a',
    'works for objects')

  t.deepEqual(
    scour([]).first().val(), undefined,
    'works for empty arrays')

  t.deepEqual(
    scour({}).first().val(), undefined,
    'works for empty objects')

  t.end()
})
