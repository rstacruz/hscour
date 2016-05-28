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

  // retrieve

  get: function get (keypath) {
    return hamt.get(this.data(), keypath)
  },

  keys: function keys () {
    return hamt.keys(this.data())
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

  // Iteration

  forEach: function (fn) {
    var keys = this.keys()
    var ctor = this.ctor
    var root = this.root
    var keypath = this.keypath
    forEach(keys, function (key, idx) {
      fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
    })
  },

  map: function (fn) {
    var keys = this.keys()
    var ctor = this.ctor
    var root = this.root
    var keypath = this.keypath
    return map(keys, function (key, idx) {
      return fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
    })
  },

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

function S (data) {
  return new scour({ data: data })
}

S.prototype = scour.prototype

module.exports = S
