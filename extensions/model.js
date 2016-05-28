var buildExtensions = require('../lib/build_extensions')
var forEach = require('fast.js/array/forEach')
var assign = require('fast.js/object/assign')

module.exports = function (scour, extensions) {
  var exts = buildExtensions(extensions)

  return scour.extend({
    init: function (options) {
      scour.class.prototype.init.call(this, options)
      var path = this.keypath.join('.')
      var self = this
      forEach(exts, function (extension) {
        if (extension[0].test(path)) assign(self, extension[1])
      })
    }
  })
}
