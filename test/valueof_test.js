'use strict'

const test = require('tape')
const scour = require('../index')

test('valueOf', (t) => {
  t.deepEqual(
    scour({ show: true }).valueOf(),
    { show: true },
    'objects')

  t.deepEqual(
    scour([ 1, 2, 3 ]).valueOf(),
    [ 1, 2, 3 ],
    'arrays')

  t.deepEqual(scour(123).valueOf(), 123, 'numbers')
  t.deepEqual(scour('hello').valueOf(), 'hello', 'strings')
  t.deepEqual(scour(true).valueOf(), true, 'true')
  t.deepEqual(scour(false).valueOf(), false, 'false')
  t.deepEqual(scour(null).valueOf(), null, 'null')
  t.deepEqual(scour(undefined).valueOf(), undefined, 'undefined')

  t.end()
})
