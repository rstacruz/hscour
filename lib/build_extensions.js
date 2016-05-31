'use strict'

var reduce = require('fast.js/object/reduce')

/**
 * Internal: builds extensions based on parameters passed onto `.use()`.
 *
 *     buildExtensions({ 'users.*': props })
 *     // => [ /^users\.[^.]+$/, props ]
 */

module.exports = function buildExtensions (extensions) {
  return reduce(extensions, function (list, properties, keypath) {
    keypath = keypath
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '::all::')
      .replace(/\*/g, '::any::')
      .replace(/::all::/g, '.*')
      .replace(/::any::/g, '[^\\.]+')

    keypath = new RegExp('^' + keypath + '$')
    return list.concat([ [ keypath, properties ] ])
  }, [])
}
