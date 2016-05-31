'use strict'

var test = require('tape')
var scour = require('../index')
var model = require('../extensions/model')

var data = { users: { 1: { name: 'john' } } }

function fullname () { return 'Mr. ' + this.get('name') }
function users () { return this.go('users') }

test('.use()', (t) => {
  t.deepEqual(
    scour.use(model, { 'users.*': { fullname } })(data)
      .go(['users', '1'])
      .fullname(),
    'Mr. john',
    'users.*')

  t.deepEqual(
    scour.use(model, { '': { users } })(data)
      .users()
      .get('1.name'),
    'john',
    'root')

  t.deepEqual(
    scour.use(model, { '**': { users } })(data)
      .users()
      .get('1.name'),
    'john',
    '** on root')

  t.deepEqual(
    scour.use(model, { '**': { fullname } })(data)
      .go('users.1')
      .fullname(),
    'Mr. john',
    '** on non-root')

  t.deepEqual(
    scour.use(model, { 'users.*': { fullname } })(data)
      .go('users')
      .go(1)
      .fullname(),
    'Mr. john',
    'users.* (with multiple .go)')

  t.deepEqual(
    scour.use(model, { '**': { fullname } })(data)
      .go('users')
      .goRoot()
      .go('users').go(1)
      .fullname(),
    'Mr. john',
    'carries over to new root')

  var e1 = { 'users.*': { fullname } }
  var e2 = { 'users.*': { greeting } }
  t.deepEqual(
    scour.use(model, e1).use(model, e2)(data)
      .go(['users', 1])
      .greeting(),
    'Hello, Mr. john',
    'stacks')

  t.end()
})

function greeting () {
  return `Hello, ${this.fullname()}`
}
