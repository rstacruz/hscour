var normalize = require('@rstacruz/nested-hamt/lib/normalize_keypath')

/*
 * Joins 2 keypaths.
 */

module.exports = function join (left, right) {
  if (typeof left === 'string' && typeof right === 'string') {
    if (left.length && right.length) {
      return left + '.' + right
    } else if (left.length) {
      return right
    } else if (right.length) {
      return left
    }
  }

  return normalize.toArray(left).concat(normalize.toArray(right))
}
