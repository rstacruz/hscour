/* eslint-disable new-cap, no-new */
'use strict'

const bm = require('./bm')
const hscour = require('../index')
const scour = require('scourjs')

const data =
  { artists:
    { 1: { id: 1, name: 'Ella Fitzgerald' },
      2: { id: 2, name: 'Frank Sinatra' },
      3: { id: 3, name: 'Miles Davis' },
      4: { id: 4, name: 'Taylor Swift' } },
    albums:
    { 1: { id: 1, name: 'Kind of Blue', genre: 'Jazz', artist_id: 3 },
      2: { id: 2, name: 'Come Fly With Me', genre: 'Jazz', artist_id: 2 },
      3: { id: 3, name: '1984', genre: 'Pop', artist_id: 4 } } }

const sData = scour(data)
const hData = hscour(data)

bm('go().get()', {
  'hscour': function () {
    hData.go('artists.1').get('name')
  },
  'scour': function () {
    sData.go('artists.1').get('name')
  }
})

bm('set()', {
  'hscour': function () {
    hData.set('artists.5.name', 'Louis Armstrong')
  },
  'scour': function () {
    sData.set('artists.5.name', 'Louis Armstrong')
  }
})

const sArtists = sData.go('artists')
const hArtists = hData.go('artists')

bm('forEach()', {
  'hscour': function () {
    hArtists.forEach(function () {})
  },
  'scour': function () {
    sArtists.forEach(function () {})
  }
})

bm('map()', {
  'hscour': function () {
    hArtists.map(function () {})
  },
  'scour': function () {
    sArtists.map(function () {})
  }
})

bm('initializing', {
  'hscour': function () {
    hscour(data)
  },
  'scour': function () {
    scour(data)
  }
})
