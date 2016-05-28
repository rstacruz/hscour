var hamt = require('@rstacruz/nested-hamt')
var join = require('./lib/join')
var forEach = require('fast.js/array/forEach')
var map = require('fast.js/array/map')

function scour (options) {
  if ('data' in options) {
    this.root = hamt.fromJS(options.data)
  } else {
    this.root = options.root
  }
  this.keypath = options.keypath || []
}

scour.prototype = {
  ctor: scour,

  valueOf: function valueOf () {
    return hamt.toJS(this.data())
  },

  // Returns a HAMT tree.
  data: function data () {
    if (this.keypath.length === 0) return this.root
    if (!('_data' in this)) this._data = hamt.getRaw(this.root, this.keypath)
    return this._data
  },

  // Chain/travesal

  goRoot: function root () {
    return new this.ctor({
      root: this.root
    })
  },

  go: function go (keypath) {
    return new this.ctor({
      root: this.root,
      keypath: join(this.keypath, keypath)
    })
  },

  at: function at (idx) {
    var key = this.keys()[idx]
    return new this.ctor({
      root: this.root,
      keypath: join(this.keypath, key)
    })
  },

  getAt: function getAt (idx) {
    var key = this.keys()[idx]
    if (key) return hamt.get(this.data(), key)
  },

  filter: null,

  reject: null,

  find: null,

  first: function first () {
    return this.at(0)
  },

  last: function last () {
    var keys = this.keys()
    return new this.ctor({
      root: this.root,
      keypath: join(this.keypath, keys && keys[keys.length - 1])
    })
  },

  sortBy: null,

  // retrieve

  get: function get (keypath) {
    return hamt.get(this.data(), keypath)
  },

  len: null,

  toArray: null,

  keys: function keys () {
    return hamt.keys(this.data()) || []
  },

  // update

  set: function set (keypath, val) {
    return new this.ctor({
      root: hamt.set(this.root, join(this.keypath, keypath), val),
      keypath: this.keypath
    })
  },

  del: function del (keypath) {
    return new this.ctor({
      root: hamt.del(this.root, join(this.keypath, keypath), val),
      keypath: this.keypath
    })
  },

  extend: function extend () {
    var newVal = hamt.extend.apply(null, [this.data()].concat([].slice.call(arguments)))
    return new this.ctor({
      root: hamt.setRaw(this.root, this.keypath, newVal),
      keypath: this.keypath
    })
  },

  // Utils
  
  use: null,

  index: null,

  toJSON: null,

  equal: null,

  // Iteration

  forEach: iteration(forEach),

  map: iteration(map),

  mapObject: null,

  indexedMap: function (fn) {
    var keys = this.keys()
    var obj = {}
    var ctor = this.ctor
    var root = this.root
    var keypath = this.keypath
    return map(keys, function (key, idx) {
      var res = fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
      obj[res[0]] = res[1]
    })
    return obj
  }
}

function iteration (iteratorFn) {
  return function (fn) {
    var keys = this.keys()
    var ctor = this.ctor
    var root = this.root
    var keypath = this.keypath
    iteratorFn(keys, function (key, idx) {
      return fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
    })
  }
}

function S (data) {
  return new scour({ data: data })
}

S.prototype = scour.prototype

module.exports = S
