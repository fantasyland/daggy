/**
  # Daggy

  Library for creating tagged constructors.
**/
(function(global, factory) {
    'use strict';

    if(typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if(typeof exports !== 'undefined') {
        factory(exports);
    } else {
        global.daggy = {};
        factory(global.daggy);
    }
})(this, function(exports) {
    function create(proto) {
        function Ctor() {}
        Ctor.prototype = proto;
        return new Ctor();
    }
    exports.create = create;

    /**
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
    **/
    function getInstance(self, constructor) {
        return self instanceof constructor ? self : create(constructor.prototype);
    }
    exports.getInstance = getInstance;

    /**
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
    **/
    function tagged() {
        var fields = [].slice.apply(arguments);
        function wrapped() {
            var self = getInstance(this, wrapped),
                i;

            if(arguments.length != fields.length)
                throw new TypeError('Expected ' + fields.length + ' arguments, got ' + arguments.length);

            for(i = 0; i < fields.length; i++)
                self[fields[i]] = arguments[i];

            return self;
        }
        wrapped._length = fields.length;
        return wrapped;
    }
    exports.tagged = tagged;

    /**
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
    **/
    function taggedSum(constructors) {
        var key;

        function definitions() {
            throw new TypeError('Tagged sum was called instead of one of its properties.');
        }

        function makeCata(key) {
            return function(dispatches) {
                var fields = constructors[key],
                    args = [],
                    i;

                if(!dispatches[key])
                    throw new TypeError("Constructors given to cata didn't include: " + key);

                for(i = 0; i < fields.length; i++)
                    args.push(this[fields[i]]);

                return dispatches[key].apply(this, args);
            };
        }

        function makeProto(key) {
            var proto = create(definitions.prototype);
            proto.cata = makeCata(key);
            return proto;
        }

        for(key in constructors) {
            if(!constructors[key].length) {
                definitions[key] = makeProto(key);
                continue;
            }
            definitions[key] = tagged.apply(null, constructors[key]);
            definitions[key].prototype = makeProto(key);
        }

        return definitions;
    }
    exports.taggedSum = taggedSum;
});
