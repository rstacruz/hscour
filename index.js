'use strict'
var hamt = require('@rstacruz/nested-hamt')
var join = require('./lib/join')
var forEach = require('fast.js/array/forEach')
var map = require('fast.js/array/map')
var assign = require('fast.js/object/assign')

function scour (options) {
  this.init(options)
}

assign(scour.prototype, {
  init: function init (options) {
    if ('data' in options) {
      this.root = hamt.fromJS(options.data)
    } else {
      this.root = options.root
    }
    this.keypath = options.keypath || []
  },

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
    return new this.constructor({
      root: this.root
    })
  },

  go: function go (keypath) {
    keypath = pathFromArgs(arguments)
    return new this.constructor({
      root: this.root,
      keypath: join(this.keypath, keypath)
    })
  },

  at: function at (idx) {
    var key = this.keys()[idx]
    if (!key) return new this.constructor({}) // undefined
    return new this.constructor({
      root: this.root,
      keypath: join(this.keypath, key)
    })
  },

  getAt: function getAt (idx) {
    var key = this.keys()[idx]
    if (key) return hamt.get(this.data(), key)
  },

  first: function first () {
    return this.at(0)
  },

  last: function last () {
    var keys = this.keys()
    if (!keys || keys.length === 0) return new this.constructor({}) // undefined
    return new this.constructor({
      root: this.root,
      keypath: join(this.keypath, keys && keys[keys.length - 1])
    })
  },

  // retrieve

  get: function get (keypath) {
    keypath = pathFromArgs(arguments)
    var data = this.data()
    if (isHamt(data)) return hamt.get(data, keypath)
    if (!keypath || keypath.length === 0) return data
  },

  toArray: null,

  keys: function keys () {
    var data = this.data()
    if (isHamt(data)) return hamt.keys(data)
    else return Object.keys(hamt.toJS(data) || {})
  },

  len: function len () {
    var data = this.data()
    if (!data) return 0
    return isHamt(data) ? hamt.len(data) : data.length
  },

  // update

  set: function set (keypath, val) {
    var root = (this.root && typeof this.root === 'object') ? this.root : hamt.empty
    var fullpath = join(this.keypath, keypath)
    val = toVal(val)
    return new this.constructor({
      root: hamt.set(root, fullpath, val),
      keypath: this.keypath,
      operation: { op: 'set', path: fullpath, val: val }
    })
  },

  del: function del (keypath) {
    keypath = pathFromArgs(arguments)
    var fullpath = join(this.keypath, keypath)
    if (!this.root || typeof this.root !== 'object') return this
    return new this.constructor({
      root: hamt.del(this.root, fullpath),
      keypath: this.keypath,
      operation: { op: 'del', path: fullpath }
    })
  },

  extend: function extend () {
    var extensions = [].slice.call(arguments)
    var newVal = hamt.extend.apply(null, [this.data()].concat(extensions))
    return new this.constructor({
      root: hamt.setRaw(this.root, this.keypath, newVal),
      keypath: this.keypath,
      operation: { op: 'extend', path: this.keypath, val: extensions }
    })
  },

  // Utils

  index: null,

  toJSON: null,

  equal: function (other) {
    return other && other.root && other.keypath &&
      this.root === other.root &&
      this.keypath.join('.') === other.keypath.join('.')
  },

  // Iteration

  forEach: iteration(forEach),

  map: iteration(map)
})

scour.prototype.val = scour.prototype.valueOf
scour.prototype.toJSON = scour.prototype.valueOf
scour.prototype.each = scour.prototype.forEach

function iteration (iteratorFn) {
  return function (fn) {
    var keys = this.keys()
    var ctor = this.constructor
    var root = this.root
    var keypath = this.keypath
    iteratorFn(keys, function (key, idx) {
      return fn(new ctor({ root: root, keypath: join(keypath, key) }), key, idx)
    })
  }
}

function toVal (val) {
  return val.valueOf ? val.valueOf() : val
}

function Scour (data) {
  return new scour({ data: data })
}

Scour.class = scour

/**
 * extend : extend(properties, statics)
 * Extends the Scour object with more `properties`.
 *
 * `statics` is optional; if given, they will be added to `Scour` as static
 * properties.
 *
 * This works immutably; that is, it will never modify `Scour` itself, and will
 * always make a copy.
 *
 * Returns a new `Scour` class with additional powers.
 *
 *     let Scour = require('scour')
 *     Scour = Scour.extend({
 *       foo () { return 'bar' }
 *     })
 *
 *     let instance = new Scour({})
 *     instance.foo()  // => 'bar'
 *
 * Also see: [use()](#use)
 */

Scour.extend = require('./lib/extend')

/**
 * use : use(plugin, options)
 * Loads a given `plugin`, passing optional `options`.
 *
 *     Scour = Scour.use(plugin)
 *
 *     // Same as:
 *     Scour = plugin(Scour)
 *
 * Also see: [extend](#extend)
 */

Scour.use = function (plugin, options) {
  var args = [].slice.call(arguments, 1)
  return plugin.apply(null, [this].concat(args))
}

function isHamt (data) {
  return typeof data === 'object' && data
}

function pathFromArgs (args) {
  if (args.length === 0) return []
  if (args.length === 1) return args[0]
  else return [].slice.apply(args)
}

module.exports = Scour
