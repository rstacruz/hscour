var map = require('fast.js/array/map')
var join = require('./lib/join')

module.exports = function (scour) {
  return scour.extend({
    indexedMap: indexedMap
  })
}

function indexedMap (fn) {
  var keys = this.keys()
  var obj = {}
  var ctor = this.constructor
  var root = this.root
  var keypath = this.keypath
  // use reduce
  map(keys, function (key, idx) {
    var res = fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
    obj[res[0]] = res[1]
  })
  return obj
}
