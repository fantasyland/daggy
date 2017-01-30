const { toString } = require('sanctuary-type-classes')
const type = require('sanctuary-type-identifiers')

// Name of prop used to store:
// * name of variant of a sum type
const TAG = '@@tag'
// * array of arguments used to create a value (to speed up `cata`)
const VALUES = '@@values'

// adopted version of withValue from  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
const defProp = (obj, prop, val) => {
  var desc = defProp.desc || (
    defProp.desc = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
  )
  desc.value = val
  Object.defineProperty(obj, prop, desc)
}

// optimised version of `arr.map(toString).join(', ')`
const arrToString = (arr) => {
  if (arr.length === 0) {
    return ''
  }
  let str = '(' + toString(arr[0])
  for (var i = 1; i < arr.length; i++) {
    str += ', ' + toString(arr[i])
  }
  return str + ')'
}

const tagged = (typeName, fields) => {
  const proto = {}
  proto.toString = tagged$objToString
  // this way we avoid named function
  const typeRep = (0, (...args) => tagged$makeValue(typeRep, fields, args))
  Object.assign(typeRep, {
    toString: typeRepToString,
    prototype: proto,
    is: isType,
    '@@type': typeName
  })
  proto.constructor = typeRep
  return typeRep
}

// [1] - possible other names are: `hasInstance`, `isVariant`
// [2] - it might not be the best choise to also define is on value as
//       user could use `===` as there should only be one such value.
const taggedSum = (typeName, definitions) => {
  const proto = {}
  proto.cata = taggedSum$cata
  proto.toString = taggedSum$objToString
  const typeRep = {
    toString: typeRepToString,
    prototype: proto,
    is: isType, // [1]
    '@@union': definitions,
    '@@type': typeName
  }
  proto.constructor = typeRep
  Object.keys(definitions).forEach(tag => {
    if (definitions[tag].length === 0) {
      typeRep[tag] = taggedSum$makeValue(typeRep, tag, [])
      typeRep[tag].is = taggedSum$isUnitValue // [1,2]
      return
    }
    typeRep[tag] = (...args) => taggedSum$makeValue(typeRep, tag, args)
    typeRep[tag].is = taggedSum$isVariant // [1]
    typeRep[tag][TAG] = tag
    typeRep[tag]['@@typeRep'] = typeRep
    typeRep[tag].toString = taggedSum$constructorToString
  })
  return typeRep
}

const taggedSum$cata = function (fs) {
  const tag = this[TAG]
  if (!fs[tag]) {
    throw new TypeError("Constructors given to cata didn't include: " + tag)
  }
  return fs[tag].apply(fs, this[VALUES])
}

const taggedSum$makeValue = (typeRep, tag, values) => {
  const fields = typeRep['@@union'][tag]
  if (values.length !== fields.length) {
    throw new TypeError(`Expected ${fields.length} arguments, got ${values.length}`)
  }
  const obj = Object.create(typeRep.prototype)
  defProp(obj, VALUES, values)
  defProp(obj, TAG, tag)
  for (let idx = 0; idx < fields.length; idx++) {
    obj[fields[idx]] = values[idx]
  }
  return obj
}

const taggedSum$constructorToString = function () {
  return `${this['@@typeRep']['@@type']}.${this[TAG]}`
}

const typeRepToString = function () {
  return this['@@type']
}

const taggedSum$objToString = function () {
  return `${this.constructor['@@type']}.${this[TAG]}${arrToString(this[VALUES])}`
}

const taggedSum$isVariant = function (val) {
  return Boolean(val) &&
    this[TAG] === val[TAG] &&
    this['@@typeRep']['@@type'] === type(val)
}

const taggedSum$isUnitValue = function (val) {
  return this === val || Boolean(val) &&
    this[TAG] === val[TAG] &&
    type(this) === type(val)
}

const isType = function (val) {
  return this['@@type'] === type(val)
}

const tagged$objToString = function () {
  return `${this.constructor['@@type']}${arrToString(this[VALUES])}`
}

const tagged$makeValue = (typeRep, fields, values) => {
  if (values.length !== fields.length) {
    throw new TypeError(`Expected ${fields.length} arguments, got ${values.length}`)
  }
  const obj = Object.create(typeRep.prototype)
  defProp(obj, VALUES, values)
  for (let idx = 0; idx < fields.length; idx++) {
    obj[fields[idx]] = values[idx]
  }
  return obj
}

module.exports = {
  taggedSum,
  tagged
}
