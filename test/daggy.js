const daggy = require('../daggy');

const {constant, identity} = require('fantasy-combinators');

const List = daggy.taggedSum({
    Cons: ['head', 'tail'],
    Nil: []
});
const Type = daggy.taggedSum({
    X: ['x'],
    Y: ['y']
});

function error(a) {
    return () => {
        throw new Error(a);
    };
};

exports.tagged = {
    'when creating a tagged type, should return correct first value': function(test) {
        const a = Math.random();
        const b = Math.random();

        test.equal(daggy.tagged('a', 'b')(a, b).a, a);
        test.done();
    },
    'when creating a tagged type, should return correct second value': function(test) {
        const a = Math.random();
        const b = Math.random();

        test.equal(daggy.tagged('a', 'b')(a, b).b, b);
        test.done();
    },
    'when creating a tagged type toString shout return correct value': function(test) {
        const a = Math.random();
        const b = Math.random();

        test.equal(daggy.tagged('a', 'b')(a, b).toString(), '(' + a + ', ' + b + ')');
        test.done();
    },
    'when creating a tagged type with to many arguments throws correct error': function(test) {
        var msg = '';

        const a = Math.random();
        const b = Math.random();
        const t = daggy.tagged('a');

        try {
            t(a, b);
        } catch(e) {
            msg = e.message;
        }

        test.equal(msg, 'Expected 1 arguments, got 2');
        test.done();
    },
    'when creating a tagged type with to few arguments throws correct error': function(test) {
        var msg = '';

        const a = Math.random();
        const b = Math.random();
        const t = daggy.tagged('a', 'b', 'c');
        
        try {
            t(a, b);
        } catch(e) {
            msg = e.message;
        }
        test.equal(msg, 'Expected 3 arguments, got 2');
        test.done();
    }
};

exports.taggedSum = {
    'when creating a taggedSum and calling definition should throw correct value': function(test) {
        var msg = '';
        try {
            List();
        } catch(e) {
            msg = e.message;
        }
        test.ok(msg === 'Tagged sum was called instead of one of its properties.');
        test.done();
    },
    'when checking head value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Cons(a, List.Nil);

        test.equal(list.head, a);
        test.done();
    },
    'when checking head toString on value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Cons(a, List.Nil);

        test.equal(list.toString(), '(' + a + ', ())');
        test.done();
    },
    'when checking tail value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Cons(a, List.Nil);

        test.equal(list.tail, List.Nil);
        test.done();
    },
    'when checking tail toString on value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Nil;

        test.equal(list.toString(), '()');
        test.done();
    },
    'when checking cata without all properties throws correct error': function(test) {
        var msg = '';

        const a = Math.random();
        const list = List.Cons(a, List.Nil);

        try {
            list.cata({
                Nil: error('Failed if called')
            });
        } catch(e) {
            msg = e.message;
        }

        test.equal(msg, 'Constructors given to cata didn\'t include: Cons');
        test.done();
    },
    'when checking cata with first tagged value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Cons(a, List.Nil);
        const actual = list.cata({
            Cons: identity,
            Nil: error('Failed if called')
        });

        test.equal(actual, a);
        test.done();
    },
    'when checking cata with second tagged value should return correct value': function(test) {
        const a = Math.random();
        const list = List.Nil;
        const actual = list.cata({
            Cons: error('Failed if called'),
            Nil: constant('nil')
        });

        test.equal(actual, 'nil');
        test.done();
    },
    'when using constructor property of an instance should create a instance': function(test) {
        const a = Math.random();
        const x = List.Cons(a, List.Nil);
        const y = x.constructor(a, List.Nil);

        test.equal(x.head, y.head);
        test.done();
    },
    'when using instanceof should be Type': function(test) {
        const a = Math.random();
        const x = Type.X(a);

        test.ok(x instanceof Type);
        test.done();
    },
    'when using instanceof should be Type.X': function(test) {
        const a = Math.random();
        const x = Type.X(a);

        test.ok(x instanceof Type.X);
        test.done();
    },
    'when using instanceof should not be Type.Y': function(test) {
        const a = Math.random();
        const x = Type.X(a);

        test.ok(!(x instanceof Type.Y));
        test.done();
    }
};
