const { toString } = require('sanctuary-type-classes')
const type = require('sanctuary-type-identifiers')

// Names of prop used to store:
// * name of variant of a sum type
const TAG = '@@tag'
// * array of arguments used to create a value (to speed up `cata`)
const VALUES = '@@values'
// * `@@type` of it's returned results
const TYPE = '@@type'
// * `@@type` of variant constructor's returned results
const RET_TYPE = '@@ret_type'

const tagged = (typeName, fields) => {
  const proto = {}
  proto.toString = tagged$toString
  // this way we avoid named function
  const typeRep = makeConstructor(fields, proto)
  typeRep.toString = typeRepToString
  typeRep.prototype = proto
  typeRep.is = isType
  typeRep[TYPE] = typeName
  proto.constructor = typeRep
  return typeRep
}

const taggedSum = (typeName, constructors) => {
  const proto = {}
  proto.cata = sum$cata
  proto.toString = sum$toString
  const typeRep = {
    toString: typeRepToString,
    prototype: proto,
    is: isType,
    [TYPE]: typeName
  }
  proto.constructor = typeRep
  Object.keys(constructors).forEach(tag => {
    const fields = constructors[tag]
    const tagProto = Object.create(proto)
    defProp(tagProto, TAG, tag)
    if (fields.length === 0) {
      typeRep[tag] = makeValue(fields, tagProto, [])
      typeRep[tag].is = sum$isUnit
      return
    }
    typeRep[tag] = makeConstructor(fields, tagProto)
    typeRep[tag].is = sum$isVariant
    typeRep[tag][TAG] = tag
    typeRep[tag][RET_TYPE] = typeName
    typeRep[tag].toString = sum$ctrToString
  })
  return typeRep
}

const sum$cata = function (fs) {
  const tag = this[TAG]
  if (!fs[tag]) {
    throw new TypeError("Constructors given to cata didn't include: " + tag)
  }
  return fs[tag].apply(fs, this[VALUES])
}

const sum$ctrToString = function () {
  return `${this[RET_TYPE]}.${this[TAG]}`
}

const sum$toString = function () {
  return `${this.constructor[TYPE]}.${this[TAG]}${arrToString(this[VALUES])}`
}

const typeRepToString = function () {
  return this[TYPE]
}

const tagged$toString = function () {
  return `${this.constructor[TYPE]}${arrToString(this[VALUES])}`
}

const sum$isVariant = function (val) {
  return Boolean(val) &&
    this[TAG] === val[TAG] &&
    this[RET_TYPE] === type(val)
}

const sum$isUnit = function (val) {
  return this === val || Boolean(val) &&
    this[TAG] === val[TAG] &&
    type(this) === type(val)
}

const isType = function (val) {
  return this[TYPE] === type(val)
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
    str = str + ', ' + toString(arr[i])
  }
  return str + ')'
}

const makeConstructor= (fields, proto) => {
  switch (fields.length) {
    case 1: return function(a) { return makeValue(fields, proto, [a]) }
    case 2: return function(a, b) { return makeValue(fields, proto, [a, b]) }
    case 3: return function(a, b, c) { return makeValue(fields, proto, [a, b, c]) }
    case 4: return function(a, b, c, d) { return makeValue(fields, proto, [a, b, c, d]) }
    case 5: return function(a, b, c, d, e) { return makeValue(fields, proto, [a, b, c, d, e]) }
    case 6: return function(a, b, c, d, e, f) { return makeValue(fields, proto, [a, b, c, d, e, f]) }
    case 7: return function(a, b, c, d, e, f, g) { return makeValue(fields, proto, [a, b, c, d, e, f, g]) }
    case 8: return function(a, b, c, d, e, f, g, h) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h]) }
    case 9: return function(a, b, c, d, e, f, g, h, i) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i]) }
    case 10: return function(a, b, c, d, e, f, g, h, i, j) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i, j]) }
    default: return Object.defineProperty(
      function() { return makeValue(fields, proto, arguments) },
      "length",
      { value: fields.length }
    )
  }
}

module.exports = {
  taggedSum,
  tagged
}
