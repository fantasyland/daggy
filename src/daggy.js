const getInstance = require('fantasy-helpers/src/get-instance');
const {constant} = require('fantasy-combinators');

/**
  ## `daggy.tagged(arguments)`

  Creates a new constructor with the given field names as
  arguments and properties. Allows `instanceof` checks with
  returned constructor.

  ```javascript
  const Tuple3 = daggy.tagged('x', 'y', 'z');

  const _123 = Tuple3(1, 2, 3); // optional new keyword
  _123.x == 1 && _123.y == 2 && _123.z == 3; // true
  _123 instanceof Tuple3; // true
  ```
**/
function tagged() {
    const fields = [].slice.apply(arguments);

    function toString(args) {
      const x = [].slice.apply(args);
      return () => {
        const values = x.map((y) => y.toString());
        return '(' + values.join(', ') + ')';
      };
    }

    function wrapped() {
        const self = getInstance(this, wrapped);
        var i;

        if(arguments.length != fields.length)
            throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);

        for(i = 0; i < fields.length; i++)
            self[fields[i]] = arguments[i];

        self.toString = toString(arguments);

        return self;
    }
    wrapped._length = fields.length;
    return wrapped;
}

/**
  ## `daggy.taggedSum(constructors)`

  Creates a constructor for each key in `constructors`. Returns a
  function with each constructor as a property. Allows
  `instanceof` checks for each constructor and the returned
  function.

  ```javascript
  const Option = daggy.taggedSum({
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
**/
function taggedSum(constructors) {
    var key,
        ctor;

    function definitions() {
        throw new TypeError('Tagged sum was called instead of one of its properties.');
    }

    function makeCata(key) {
        // Note: we need the prototype from this function.
        return function(dispatches) {
            var i;

            const fields = constructors[key];
            const args = [];

            if(!dispatches[key])
                throw new TypeError("Constructors given to cata didn't include: " + key);

            for(i = 0; i < fields.length; i++)
                args.push(this[fields[i]]);

            return dispatches[key].apply(this, args);
        };
    }

    function makeProto(key) {
        const proto = Object.create(definitions.prototype);
        proto.cata = makeCata(key);
        return proto;
    }

    for(key in constructors) {
        if(!constructors[key].length) {
            definitions[key] = makeProto(key);
            definitions[key].toString = constant('()');
            continue;
        }
        ctor = tagged.apply(null, constructors[key]);
        definitions[key] = ctor;
        definitions[key].prototype = makeProto(key);
        definitions[key].prototype.constructor = ctor;
    }

    return definitions;
}

exports = module.exports = {tagged, taggedSum};
