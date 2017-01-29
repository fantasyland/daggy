# Daggy

Library for creating tagged constructors.

## `daggy.tagged(arguments)`

Creates a new constructor with the given field names as
arguments and properties. Allows `TypeRep.is` checks with
returned constructor.

```javascript
const Tuple3 = daggy.tagged('Tuple3', ['x', 'y', 'z'])

const _123 = Tuple3(1, 2, 3)
_123.x == 1 && _123.y == 2 && _123.z == 3 // true
Tuple3.is(_123) // true
```

## `daggy.taggedSum(constructors)`

Creates a constructor for each key in `constructors`. Returns a
function with each constructor as a property. Allows
`TypeRep.is` and `TypeRep.Tag.is` checks for values created by constructors

```javascript
const Option = daggy.taggedSum({
    Some: ['x'],
    None: []
})

Option.Some.is(Option.Some(1)) // true
Option.None.is(Option.None) // true
Option.is(Option.Some(1)) // true
Option.is(Option.None) // true

function incOrZero(o) {
    return o.cata({
        Some: function(x) {
            return x + 1
        },
        None: function() {
            return 0
        }
    })
}
incOrZero(Option.Some(1)) // 2
incOrZero(Option.None) // 0
```
