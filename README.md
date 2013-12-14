# Daggy

Library for creating tagged constructors.

## `daggy.tagged(arguments)`

Creates a new constructor with the given field names as
arguments and properties. Allows `instanceof` checks with
returned constructor.

```javascript
var Tuple3 = daggy.tagged('x', 'y', 'z');

var _123 = Tuple3(1, 2, 3); // optional new keyword
_123.x == 1 && _123.y == 2 && _123.z == 3; // true
_123 instanceof Tuple3; // true
```

## `daggy.taggedSum(constructors)`

Creates a constructor for each key in `constructors`. Returns a
function with each constructor as a property. Allows
`instanceof` checks for each constructor and the returned
function.

```javascript
var Option = daggy.taggedSum({
    Some: ['x'],
    None: []
});

Option.Some(1) instanceof Option.Some; // true
Option.Some(1) instanceof Option; // true
Option.None instanceof Option; // true

function incOrZero(o) {
    return o.cata({
        Some: function(x) {
            return x + 1;
        },
        None: function() {
            return 0;
        }
    });
}
incOrZero(Option.Some(1)); // 2
incOrZero(Option.None); // 0
```
