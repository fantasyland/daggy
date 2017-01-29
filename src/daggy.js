const { toString } = require('sanctuary-type-classes')
const type = require('sanctuary-type-identifiers')

const tagged = (typeName, fields) => {
  const proto = {}
  proto.toString = tagged$objToString
  const typeRep = (...args) => tagged$makeValue(typeRep, fields, args)
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
  proto.cata = cata
  proto.toString = objToString
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
      typeRep[tag] = makeValue(typeRep, tag, [])
      typeRep[tag].is = isUnitValue // [1,2]
      return
    }
    typeRep[tag] = (...args) => makeValue(typeRep, tag, args)
    typeRep[tag].is = isVariant // [1]
    typeRep[tag]['@@tag'] = tag
    typeRep[tag]['@@typeRep'] = typeRep
    typeRep[tag].toString = constructorToString
  })
  return typeRep
}

const tagged$objToString = function () {
  return `${this.constructor['@@type']}(${
    this['@@values'].map(a => toString(a)).join(', ')
  })`
}

const tagged$makeValue = (typeRep, fields, values) => {
  if (values.length !== fields.length) {
    throw new TypeError(`Expected ${fields.length} arguments, got ${values.length}`)
  }
  const obj = Object.create(typeRep.prototype)
  obj['@@values'] = values
  for (let idx = 0; idx < fields.length; idx++) {
    obj[fields[idx]] = values[idx]
  }
  return obj
}

const cata = function (fs) {
  const union = this.constructor['@@union']
  for (let tag in union) {
    if (union.hasOwnProperty(tag) && typeof fs[tag] !== 'function') {
      throw new Error(`Constructors given to cata didn't include: ${tag}`)
    }
  }
  return fs[this['@@tag']].apply(fs, this['@@values'])
}

const makeValue = (typeRep, tag, values) => {
  const fields = typeRep['@@union'][tag]
  if (values.length !== fields.length) {
    throw new TypeError(`Expected ${fields.length} arguments, got ${values.length}`)
  }
  const obj = Object.create(typeRep.prototype)
  obj['@@values'] = values
  obj['@@tag'] = tag
  for (let idx = 0; idx < fields.length; idx++) {
    obj[fields[idx]] = values[idx]
  }
  return obj
}

const typeRepToString = function () {
  return this['@@type']
}

const constructorToString = function () {
  return `${this['@@typeRep']['@@type']}.${this['@@tag']}`
}

const objToString = function () {
  return `${this.constructor['@@type']}.${this['@@tag']}(${
    this['@@values'].map(a => toString(a)).join(', ')
  })`
}

const isType = function (val) {
  return Boolean(val) &&
    this['@@type'] === type(val)
}

const isVariant = function (val) {
  return Boolean(val) &&
    this['@@tag'] === val['@@tag'] &&
    this['@@typeRep']['@@type'] === type(val)
}

const isUnitValue = function (val) {
  return this === val || Boolean(val) &&
    this['@@tag'] === val['@@tag'] &&
    type(this) === type(val)
}

module.exports = {
  taggedSum,
  tagged
}
