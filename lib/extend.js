var assign = require('fast.js/object/assign')

/*
 * Scour.extend
 */

module.exports = function extend (props, statics) {
  var NewClass = require('simpler-extend').call(this.class, props)

  function Scour (data) {
    return new NewClass({ data: data })
  }

  assign(Scour, this)
  Scour.class = NewClass
  if (statics) assign(Scour, statics)

  return Scour
}
