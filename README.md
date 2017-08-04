# Daggy

[![Build Status](https://img.shields.io/travis/fantasyland/daggy/master.svg)](https://travis-ci.org/fantasyland/daggy)
[![npm](https://img.shields.io/npm/v/daggy.svg)](https://www.npmjs.com/package/daggy)

Library for creating tagged constructors a.k.a. "union types" or "sum types".

## `daggy.tagged(typeName, fields)`

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
```

## `daggy.taggedSum(typeName, constructors)`

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
```
