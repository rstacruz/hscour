'use strict'

const test = require('tape')
const scour = require('../index')
var model = require('../model')

const data = { users: { 1: { name: 'john' } } }

function fullname () { return 'Mr. ' + this.get('name') }
function users () { return this.go('users') }

var user, db

test('.use()', (t) => {
  t.deepEqual(
    model(scour, { 'users.*': { fullname } })(data)
      .go(['users', '1'])
      .fullname(),
    'Mr. john',
    'users.*')

  t.deepEqual(
    model(scour, { '': { users } })(data)
      .users()
      .get('1.name'),
    'john',
    'root')

  t.deepEqual(
    model(scour, { '**': { users } })(data)
      .users()
      .get('1.name'),
    'john',
    '** on root')

  t.deepEqual(
    model(scour, { '**': { fullname } })(data)
      .go('users.1')
      .fullname(),
    'Mr. john',
    '** on non-root')

  t.deepEqual(
    model(scour, { 'users.*': { fullname } })(data)
      .go('users')
      .go(1)
      .fullname(),
    'Mr. john',
    'users.* (with multiple .go)')

  t.deepEqual(
    model(scour, { '**': { fullname } })(data)
      .go('users')
      .goRoot()
      .go('users').go(1)
      .fullname(),
    'Mr. john',
    'carries over to new root')

  var e1 = { 'users.*': { fullname } }
  var e2 = { 'users.*': { greeting } }
  t.deepEqual(
    model(model(scour, e1), e2)(data)
      .go(['users', 1])
      .greeting(),
    'Hello, Mr. john',
    'stacks')

  t.end()
})

function greeting () {
  return `Hello, ${this.fullname()}`
}
