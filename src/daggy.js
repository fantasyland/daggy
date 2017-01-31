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
  const typeRep = (0, (...args) => makeValue(fields, proto, args))
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
    typeRep[tag] = (...args) => makeValue(fields, tagProto, args)
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

module.exports = {
  taggedSum,
  tagged
}
