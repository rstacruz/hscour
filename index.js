var hamt = require('@rstacruz/nested-hamt')
var join = require('./lib/join')

function scour (obj, options) {
  if (!(this instanceof scour)) return new scour(obj, options)
  if (options && 'hamt' in options) {
    this._data = options.hamt
  } else if (typeof obj !== 'undefined') {
    this._data = hamt.fromJS(obj)
  }
  this.keypath = options && options.keypath || []
  this.root = options && options.root || this
}

scour.prototype = {
  valueOf: function valueOf () {
    return hamt.toJS(this._data)
  },

  data: function data () {
    if (!('_data' in this)) {
      this._data = this.root.get(this.keypath)
    }
    return this._data
  },

  get: function get (keypath) {
    return hamt.get(this._data, keypath)
  },

  set: function set (keypath, val) {
    if (this.keypath.length !== 0) {
      var fullpath = join(this.keypath, keypath)
      return this.root
        .reset({ hamt: hamt.set(this.root._data, fullpath, val), })
        .go(this.keypath)
    }
    return this.reset({ hamt: hamt.set(this._data, keypath, val) })
  },

  go: function go (keypath) {
    return this.reset({
      hamt: hamt.getRaw(this._data, keypath),
      keypath: join(this.keypath, keypath),
      root: this.root
    })
  },

  reset: function reset (options) {
    return new scour(undefined, {
      hamt: 'hamt' in options ? options.hamt : this.hamt,
      keypath: 'keypath' in options ? options.keypath : this.keypath,
      root: 'root' in options ? options.root : this.root
    })
  }
}


module.exports = scour
