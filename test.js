var scour = require('./index')
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

  t.equal(data.get('artists.1.name'), 'Ella Fitzgerald')
  t.equal(data.go('artists').get('1.name'), 'Ella Fitzgerald')
  t.equal(data.go('artists').set('1.name', 'John').get('1.name'), 'John')
  t.deepEqual(data.get('artists.1'), source.artists[1])
  t.equal(data.extend({ a: 1 }).get('a'), 1)

  t.end()
})

test('keys', t => {
  var data = scour(source)

  t.deepEqual(data.go('artists').keys(), ['1', '2', '3', '4'])

  t.end()
})
