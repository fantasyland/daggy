# Daggy

Library for creating tagged constructors.

## `daggy.getInstance(self, constructor)`

Returns `self` if it's an `instanceof constructor`, otherwise
creates a new object with `constructor`'s prototype.

Allows creating constructors that can be used with or without
the new keyword but always have the correct prototype.

```javascript
function WrappedArray() {
    var self = daggy.getInstance(this, WrappedArray);
    self._array = [].slice.apply(arguments);
    return self;
}
new WrappedArray(1, 2, 3) instanceof WrappedArray; // true
WrappedArray(1, 2, 3) instanceof WrappedArray; // true
```

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
