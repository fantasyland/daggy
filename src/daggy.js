const { toString } = require('sanctuary-type-classes')
const type = require('sanctuary-type-identifiers')

// Name of prop used to store:
// * name of variant of a sum type
const TAG = '@@tag'
// * array of arguments used to create a value (to speed up `cata`)
const VALUES = '@@values'
// * `@@type` of it's returned results
const TYPE = '@@type'
// * `TYPE` of it's returned results
const RET_TYPE = '@@ret_type'

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
  const typeRep = (0, (...args) => makeValue(fields, proto, args))
  typeRep.toString = typeRepToString
  typeRep.prototype = proto
  typeRep.is = isType
  typeRep[TYPE] = typeName
  proto.constructor = typeRep
  return typeRep
}

const taggedSum = (typeName, definitions) => {
  const proto = {}
  proto.cata = taggedSum$cata
  proto.toString = taggedSum$objToString
  const typeRep = {
    toString: typeRepToString,
    prototype: proto,
    is: isType, // [1]
    [TYPE]: typeName
  }
  proto.constructor = typeRep
  Object.keys(definitions).forEach(tag => {
    const fields = definitions[tag]
    const tagProto = Object.create(typeRep.prototype)
    defProp(tagProto, TAG, tag)
    if (fields.length === 0) {
      typeRep[tag] = makeValue(fields, tagProto, [])
      typeRep[tag].is = taggedSum$isUnitValue
      return
    }
    typeRep[tag] = (...args) => makeValue(fields, tagProto, args)
    typeRep[tag].is = taggedSum$isVariant
    typeRep[tag][TAG] = tag
    typeRep[tag][RET_TYPE] = typeName
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

const taggedSum$constructorToString = function () {
  return `${this[RET_TYPE]}.${this[TAG]}`
}

const typeRepToString = function () {
  return this[TYPE]
}

const taggedSum$objToString = function () {
  return `${this.constructor[TYPE]}.${this[TAG]}${arrToString(this[VALUES])}`
}

const taggedSum$isVariant = function (val) {
  return Boolean(val) &&
    this[TAG] === val[TAG] &&
    this[RET_TYPE] === type(val)
}

const taggedSum$isUnitValue = function (val) {
  return this === val || Boolean(val) &&
    this[TAG] === val[TAG] &&
    type(this) === type(val)
}

const isType = function (val) {
  return this[TYPE] === type(val)
}

const tagged$objToString = function () {
  return `${this.constructor[TYPE]}${arrToString(this[VALUES])}`
}

const makeValue = (fields, proto, values) => {
  if (values.length !== fields.length) {
    throw new TypeError(`Expected ${fields.length} arguments, got ${values.length}`)
  }
  const obj = Object.create(proto)
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
