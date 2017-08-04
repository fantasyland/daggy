(function(f) {

  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('sanctuary-type-classes'),
                       require('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-type-classes',
            'sanctuary-type-identifiers'],
           f);
  } else {
    self.daggy = f(self.sanctuaryTypeClasses,
                   self.sanctuaryTypeIdentifiers);
  }

}(function(Z, type) {

  'use strict';

  // Names of prop used to store:
  // * name of variant of a sum type
  var TAG = '@@tag';
  // * array of arguments used to create a value (to speed up `cata`)
  var VALUES = '@@values';
  // * `@@type` of its returned results
  var TYPE = '@@type';
  // * `@@type` of variant constructor's returned results
  var RET_TYPE = '@@ret_type';

  function tagged(typeName, fields) {
    var proto = {toString: tagged$toString};
    // this way we avoid named function
    var typeRep = makeConstructor(fields, proto);
    typeRep.toString = typeRepToString;
    typeRep.prototype = proto;
    typeRep.is = isType;
    typeRep[TYPE] = typeName;
    proto.constructor = typeRep;
    return typeRep;
  }

  function taggedSum(typeName, constructors) {
    var proto = {cata: sum$cata, toString: sum$toString};
    var typeRep = proto.constructor = {
      toString: typeRepToString,
      prototype: proto,
      is: isType,
      '@@type': typeName
    };
    Object.keys(constructors).forEach(function(tag) {
      var fields = constructors[tag];
      var tagProto = Object.create(proto);
      defProp(tagProto, TAG, tag);
      if (fields.length === 0) {
        typeRep[tag] = makeValue(fields, tagProto, [], 0);
        typeRep[tag].is = sum$isUnit;
        return;
      }
      typeRep[tag] = makeConstructor(fields, tagProto);
      typeRep[tag].is = sum$isVariant;
      typeRep[tag][TAG] = tag;
      typeRep[tag][RET_TYPE] = typeName;
      typeRep[tag].toString = sum$ctrToString;
    });
    return typeRep;
  }

  function sum$cata(fs) {
    var tag = this[TAG];
    if (!fs[tag]) {
      throw new TypeError("Constructors given to cata didn't include: " + tag);
    }
    return fs[tag].apply(fs, this[VALUES]);
  }

  function sum$ctrToString() {
    return this[RET_TYPE] + '.' + this[TAG];
  }

  function sum$toString() {
    return this.constructor[TYPE] + '.' +
           this[TAG] + arrToString(this[VALUES]);
  }

  function typeRepToString() {
    return this[TYPE];
  }

  function tagged$toString() {
    return this.constructor[TYPE] + arrToString(this[VALUES]);
  }

  function sum$isVariant(val) {
    return Boolean(val) &&
      this[TAG] === val[TAG] &&
      this[RET_TYPE] === type(val);
  }

  function sum$isUnit(val) {
    return this === val || Boolean(val) &&
      this[TAG] === val[TAG] &&
      type(this) === type(val);
  }

  function isType(val) {
    return this[TYPE] === type(val);
  }

  function makeValue(fields, proto, values, argumentsLength) {
    if (argumentsLength !== fields.length) {
      throw new TypeError(
        'Expected ' + fields.length + ' arguments, got ' + argumentsLength
      );
    }
    var obj = Object.create(proto);
    defProp(obj, VALUES, values);
    for (var idx = 0; idx < fields.length; idx += 1) {
      obj[fields[idx]] = values[idx];
    }
    return obj;
  }

  // adopted version of withValue from  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  function defProp(obj, prop, val) {
    var desc = defProp.desc || (
      defProp.desc = {
        enumerable: false,
        writable: false,
        configurable: false,
        value: null
      }
    );
    desc.value = val;
    Object.defineProperty(obj, prop, desc);
  }

  // optimised version of `arr.map(toString).join(', ')`
  function arrToString(arr) {
    if (arr.length === 0) return '';
    var str = '(' + Z.toString(arr[0]);
    for (var idx = 1; idx < arr.length; idx += 1) {
      str = str + ', ' + Z.toString(arr[idx]);
    }
    return str + ')';
  }

  function makeConstructor(fields, proto) {
    switch (fields.length) {
      /* eslint-disable max-len */
      case  1: return function(a) { return makeValue(fields, proto, [a], arguments.length); };
      case  2: return function(a, b) { return makeValue(fields, proto, [a, b], arguments.length); };
      case  3: return function(a, b, c) { return makeValue(fields, proto, [a, b, c], arguments.length); };
      case  4: return function(a, b, c, d) { return makeValue(fields, proto, [a, b, c, d], arguments.length); };
      case  5: return function(a, b, c, d, e) { return makeValue(fields, proto, [a, b, c, d, e], arguments.length); };
      case  6: return function(a, b, c, d, e, f) { return makeValue(fields, proto, [a, b, c, d, e, f], arguments.length); };
      case  7: return function(a, b, c, d, e, f, g) { return makeValue(fields, proto, [a, b, c, d, e, f, g], arguments.length); };
      case  8: return function(a, b, c, d, e, f, g, h) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h], arguments.length); };
      case  9: return function(a, b, c, d, e, f, g, h, i) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i], arguments.length); };
      case 10: return function(a, b, c, d, e, f, g, h, i, j) { return makeValue(fields, proto, [a, b, c, d, e, f, g, h, i, j], arguments.length); };
      /* eslint-enable max-len */
      default: return Object.defineProperty(
        function() {
          return makeValue(fields, proto, arguments, arguments.length);
        },
        'length',
        {value: fields.length}
      );
    }
  }

  return {tagged: tagged, taggedSum: taggedSum};

}));
