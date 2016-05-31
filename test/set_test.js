'use strict'

const test = require('tape')
const scour = require('../index')

test('.set() root', (t) => {
  var data = { users: { bob: { name: 'robert' } } }
  var result = scour(data).set(['users', 'bob'], { id: 2 })

  t.deepEqual(result.val(), { users: { bob: { id: 2 } } })
  t.deepEqual(result.keypath, [])
  t.end()
})

test('.set() dot notation', (t) => {
  var data = { bob: { name: 'Bob' } }
  var result = scour(data).set('bob.name', 'Robert')

  t.deepEqual(
    result.val(),
    { bob: { name: 'Robert' } })
  t.end()
})

test('.set()', (t) => {
  t.deepEqual(
    scour({ }).go('bob').set('name', 'Robert').goRoot().val(),
    { bob: { name: 'Robert' } },
    'allow .go().set()')

  t.deepEqual(
    scour({}).set(['ui', '1.2', 'loaded'], true).val(),
    { ui: { '1.2': { loaded: true } } },
    'allow dotted paths in an array')

  t.end()
})

test('.set() for nonroot', (t) => {
  var data = { users: { bob: { name: 'robert' } } }
  var root = scour(data)
  var users = root.go('users')
  var result = users.set(['matt'], { name: 'matthew' })

  t.deepEqual(
    result.goRoot().val(),
    { users:
      { bob: { name: 'robert' },
        matt: { name: 'matthew' } } },
    'sets correct values in root')

  t.deepEqual(
    result.goRoot().keypath, [], 'sets root keypath')
  t.deepEqual(
    result.keypath, ['users'], 'sets keypath')
  t.deepEqual(
    root.val(), { users: { bob: { name: 'robert' } } },
    'leaves old values unchanged')

  t.end()
})

test('.set() with wrapping', (t) => {
  var a = scour({ a: true })
  var b = scour({ b: true })

  t.deepEqual(
    a.set('c', b).val(),
    { a: true, c: { b: true } })

  t.end()
})
