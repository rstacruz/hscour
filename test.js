var scour = require('./index')
var _scour = require('scourjs')
var test = require('tape')

const source =
  { artists:
    { 1: { id: 1, name: 'Ella Fitzgerald' },
      2: { id: 2, name: 'Frank Sinatra' },
      3: { id: 3, name: 'Miles Davis' },
      4: { id: 4, name: 'Taylor Swift' } },
    albums:
    { 1: { id: 1, name: 'Kind of Blue', genre: 'Jazz', artist_id: 3 },
      2: { id: 2, name: 'Come Fly With Me', genre: 'Jazz', artist_id: 2 },
      3: { id: 3, name: '1984', genre: 'Pop', artist_id: 4 } } }

test('scour', t => {
  var data = scour(source)

  t.equal(data.get('artists.1.name'), 'Ella Fitzgerald', 'get() deep')
  t.equal(data.go('artists').get('1.name'), 'Ella Fitzgerald', 'go().get()')
  t.equal(data.go('artists').set('1.name', 'John').get('1.name'), 'John', 'go().set()')
  t.deepEqual(data.get('artists.1'), source.artists[1], 'get() deep, object')
  t.equal(data.extend({ a: 1 }).get('a'), 1, 'extend')

  t.end()
})

test('keys', t => {
  var data = scour(source)
  t.deepEqual(data.go('artists').keys(), ['1', '2', '3', '4'])
  t.end()
})

test('go()', t => {
  t.deepEqual(scour({a: 'hi'}).go('a').val(), 'hi', 'go(str)')
  t.deepEqual(scour({1: 'hi'}).go(1).val(), 'hi', 'go(number)')
  t.end()
})

test('get()', t => {
  t.deepEqual(scour({a: 1}).get(), {a: 1}, 'objects')
  t.deepEqual(scour({}).get(), {}, 'empty objects')
  t.deepEqual(scour([1]).get(), [1], 'arrays')
  t.deepEqual(scour([]).get(), [], 'empty arrays')
  t.equal(scour('hi').get(), 'hi', 'strings')
  t.equal(scour(1).get(), 1, 'numbers')
  t.equal(scour(true).get(), true, 'true')
  t.equal(scour(false).get(), false, 'false')
  t.equal(scour(null).get(), null, 'null')
  t.equal(scour(undefined).get(), undefined, 'undefined')
  t.end()
})

test('keys()', t => {
  t.deepEqual(scour({a: 1}).keys(), ['a'], 'objects')
  t.deepEqual(scour({}).keys(), [], 'empty objects')
  t.deepEqual(scour(true).keys(), [], 'boolean')
  t.deepEqual(scour('hi').keys(), ['0', '1'], 'strings')
  t.deepEqual(scour('hi').keys(), ['0', '1'], 'strings')
  t.deepEqual(scour(null).keys(), [], 'null')
  t.deepEqual(scour(undefined).keys(), [], 'undefined')
  t.end()
})

test('first()', t => {
  t.deepEqual(scour([]).first().val(), undefined, 'array, undefined first')
  t.deepEqual(scour(['a']).first().val(), 'a', 'array, first val')
  t.deepEqual(scour({}).first().val(), undefined, 'obj, undefined first')
  t.deepEqual(scour({ key: 'a'}).first().val(), 'a', 'obj, first val')
  t.end()
})

test('last()', t => {
  t.deepEqual(scour([]).last().val(), undefined, 'array, undefined last')
  t.deepEqual(scour(['a']).last().val(), 'a', 'array, last val')
  t.deepEqual(scour({}).last().val(), undefined, 'obj, undefined last')
  t.deepEqual(scour({ key: 'a'}).last().val(), 'a', 'obj, last val')
  t.end()
})
