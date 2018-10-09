# Daggy

[![Build Status](https://img.shields.io/travis/fantasyland/daggy/master.svg)](https://travis-ci.org/fantasyland/daggy)
[![npm](https://img.shields.io/npm/v/daggy.svg)](https://www.npmjs.com/package/daggy)

Library for creating tagged constructors a.k.a. "disjoint union types" or "sum types".

## Motivation

JavaScript does not have first class support for sum types, but they can be imitated in a handful of different ways. Nevertheless, this imitation leads to excess boilerplate that can lead to extra work and the potential for errors:

```javascript
const successCase = { success: true, items: [1, 2, 3] }
const failureCase = { success: false, error: 'There was a problem.' }

function handleResult(result) {
  if (result.success) {
    console.log(result.items)
  } else {
    console.error(result.error)
  }
}
```

Daggy reduces the boilerplate needed to represent sum types in JavaScript:

```javascript
const Result = daggy.taggedSum('Result', {
  Success: ['items'],
  Failure: ['error']
})

const successCase = Result.Success([1, 2, 3])
const failureCase = Result.Failure('There was a problem.')

function handleResult(result) {
  result.cata({
    Success: message => console.log(message),
    Failure: error => console.error(error)
  })
}
```

## API

### `daggy.tagged(typeName, fields)`

Creates a new constructor with the given field names

```javascript
const Point3D = daggy.tagged('Point3D', ['x', 'y', 'z'])
Point3D.toString() // 'Point3D'
const a = Point3D(1, 2, 3) // { x: 1, y: 2, z: 3 }
a.x == 1 && a.y == 2 && a.z == 3 // true
a.toString() // 'Point3D(1, 2, 3)'
Point3D.is(a) // true
Point3D.prototype.scale = function(n){
  return Point3D(this.x * n, this.y * n, this.z * n)
}
const b = a.scale(2) // { x: 2, y: 4, z: 6 }
b.toString() // 'Point3D(2, 4, 6)'
const c = Point3D.from({y: 2, x: 1, z: 3}) // { x: 1, y: 2, z: 3 }
```

### `daggy.taggedSum(typeName, constructors)`

Returns Type Representative containing constructors of for each key in `constructors` as a property. Allows `{TypeRep}.is` and `{TypeRep}.{Tag}.is` checks for values created by constructors.

```javascript
const Option = daggy.taggedSum('Option', {
  Some: ['x'],
  None: [],
})
const a = Option.Some(1) // { x: 1 }
a.toString() // 'Option.Some(1)'
Option.Some.is(a) // true
Option.is(a) // true
Option.None.is(Option.None) // true
Option.is(Option.None) // true
Option.None.toString() // 'Option.None'
Option.Some.toString() // 'Option.Some'
Option.prototype.map = function (f) {
  return this.cata({
    Some: (x) => Option.Some(f(x)),
    None: () => this,
  })
}
const b = a.map(x => x+1) // { x: 2 }
b.toString() // 'Option.Some(2)'
const c = Option.Some.from({x: 1}) // { x: 1 }
```
