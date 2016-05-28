var Search = require('scour-search')
var forEach = require('fast.js/object/forEach')
var nz = require('@rstacruz/nested-hamt/lib/normalize_keypath')

/*
 *     scour = indexed(scour, { users: 'name' })
 */

module.exports = function (scour, indices) {
  var searchIndices = {}
  
  if (indices) {
    forEach(indices, function (field, keypath) {
      searchIndices[keypath] = Search({}).index(field)
    })
  }

  return scour.extend({
    init: function (options) {
      scour.class.prototype.init.call(this, options)
      if (options.operation && mutates(op.operation.name)) {
        // updateIndices(searchIndices, data, [ op.operation.keypath ])
      }
    },

    filter: function (conditions) {
    },

    reject: null,

    find: null,

    sortBy: null
  })
}

function mutates (op) {
  return op === 'set' || op === 'del' || op === 'extend'
}
