var daggy = require('../daggy'),
    List = daggy.taggedSum({
        Cons: ['head', 'tail'],
        Nil: []
    }),
    identity = function(a) {
        return a;
    },
    constant = function(a) {
        return function() {
            return a;
        };
    },
    error = function(a) {
        return function() {
            throw new Error(a);
        };
    };

exports.tagged = {
    'when creating a tagged type, should return correct first value': function(test) {
        var a = Math.random(),
            b = Math.random();

        test.equal(daggy.tagged('a', 'b')(a, b).a, a);
        test.done();
    },
    'when creating a tagged type, should return correct second value': function(test) {
        var a = Math.random(),
            b = Math.random();

        test.equal(daggy.tagged('a', 'b')(a, b).b, b);
        test.done();
    },
    'when creating a tagged type with to many arguments throws correct error': function(test) {
        var a = Math.random(),
            b = Math.random(),
            t = daggy.tagged('a'),
            msg = '';

        try {
            t(a, b);
        } catch(e) {
            msg = e.message;
        }

        test.equal(msg, 'Expected 1 arguments, got 2');
        test.done();
    },
    'when creating a tagged type with to few arguments throws correct error': function(test) {
        var a = Math.random(),
            b = Math.random(),
            t = daggy.tagged('a', 'b', 'c'),
            msg = '';

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
        var a = Math.random(),
            list = List.Cons(a, List.Nil);

        test.equal(list.head, a);
        test.done();
    },
    'when checking tail value should return correct value': function(test) {
        var a = Math.random(),
            list = List.Cons(a, List.Nil);

        test.equal(list.tail, List.Nil);
        test.done();
    },
    'when checking cata without all properties throws correct error': function(test) {
        var a = Math.random(),
            list = List.Cons(a, List.Nil),
            msg = '';

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
        var a = Math.random(),
            list = List.Cons(a, List.Nil),
            actual = list.cata({
                Cons: identity,
                Nil: error('Failed if called')
            });

        test.equal(actual, a);
        test.done();
    },
    'when checking cata with second tagged value should return correct value': function(test) {
        var a = Math.random(),
            list = List.Nil,
            actual = list.cata({
                Cons: error('Failed if called'),
                Nil: constant('nil')
            });

        test.equal(actual, 'nil');
        test.done();
    },
};
