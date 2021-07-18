const show = require('sanctuary-show')
const { test } = require('tap')
const { tagged, taggedSum } = require('../src/daggy')

const Tuple = tagged('Tuple', ['_1', '_2'])

const List = taggedSum('List', {
  Cons: ['x', 'xs'],
  Nil: []
})

Tuple.prototype.foo = 'foo'
List.prototype.foo = 'foo'

const a = 'a'
const b = 'b'

test('tagged', (t) => {
  const tpl = Tuple(a, b)
  t.throws(
    () => { Tuple(1) },
    new TypeError(`Expected 2 arguments, got 1`),
    'when creating a tagged type with fewer arguments throws error'
  )
  t.throws(
    () => { Tuple(1, 2, 3) },
    new TypeError(`Expected 2 arguments, got 3`),
    'when creating a tagged type with too many arguments throws error'
  )
  t.same(tpl.toString(), `Tuple(${show(a)}, ${show(b)})`, 'toString on value should work')
  t.same(Tuple.toString(), `Tuple`, 'toString on type should work')
  t.same(show(tpl), `Tuple(${show(a)}, ${show(b)})`, 'show on tuple should work')
  t.same(show(Tuple), `Tuple`, 'show on type should work')
  t.same(tpl._1, a, 'when checking _1 value should return correct value')
  t.same(tpl._2, b, 'when checking _2 value should return correct value')
  t.same(tpl.constructor, Tuple, 'constructor on value should refer to TypeRep of the value')
  t.ok(Tuple.is(tpl), '`is` on type works')
  t.notOk(Tuple.is({}), '`is` on type works')
  t.same(Tuple.prototype.foo, tpl.foo, 'values in typerep.prototype are accessible from instance values')
  t.ok(Tuple.prototype.isPrototypeOf(tpl), 'prototype chain is correct')
  t.test('build from object', (t) => {
    const tpl = Tuple.from({_2: b, _1: a})
    t.same(tpl._1, a, 'First value on tuple is correct')
    t.same(tpl._2, b, 'Second value on tuple is correct')
    t.throws(
      () => { Tuple.from({ _1: 1 }) },
      new TypeError('Missing field: _2'),
      'when creating a tagged type from an object with a missing field'
    )
    t.end()
  })
  t.test('tag.is() is pre-bound to the rep', (t) => {
    const isTuple = Tuple.is
    const list = List.Nil
    t.doesNotThrow(
      () => { isTuple(tpl) },
      'tag.is() can be assigned to an unbound var and used separate to test instances'
    )
    t.ok(isTuple(tpl), 'tag.is() should correctly identify instances even when used as an unbound var')
    t.notOk(isTuple(list), 'tag.is() should correctly not identify instances of other types even when used as an unbound var')
    t.end()
  })
  t.end()
})

test('taggedSum', (t) => {
  const list = List.Cons(a, List.Nil)
  t.throws(
    () => { List.Cons(1) },
    new TypeError(`Expected 2 arguments, got 1`),
    'when creating a taggedSum type with to many arguments throws error'
  )
  t.throws(
    () => { List.Cons(1, 1, 1) },
    new TypeError(`Expected 2 arguments, got 3`),
    'when creating a taggedSum type with to many arguments throws error'
  )
  t.throws(
    () => { List.Nil.cata({}) },
    new Error(`Constructors given to cata didn't include: Cons`),
    'throws if all cases are not handled'
  )
  t.throws(
    () => { list.cata({}) },
    new Error(`Constructors given to cata didn't include: Cons`),
    'throws if all cases are not handled'
  )
  t.throws(
    () => { List.Nil.cata({ Nil: () => false }) },
    new Error(`Constructors given to cata didn't include: Cons`),
    'throws if some cases are not handled'
  )
  t.throws(
    () => { list.cata({ Cons: () => true }) },
    new Error(`Constructors given to cata didn't include: Nil`),
    'throws if some cases are not handled'
  )
  t.same(list.toString(), `List.Cons(${show(a)}, List.Nil)`, 'toString on value should work')
  t.same(List.toString(), 'List', 'toString on type should work')
  t.same(List.Cons.toString(), 'List.Cons', 'toString on variant constructor should work')
  t.same(List.Nil.toString(), 'List.Nil', 'toString on unit variant should work')
  t.same(show(list), `List.Cons(${show(a)}, List.Nil)`, 'show on list should work')
  t.same(show(List), 'List', 'show on type should work')
  t.same(show(List.Cons), 'List.Cons', 'show on variant constructor should work')
  t.same(show(List.Nil), 'List.Nil', 'show on unit variant should work')
  t.same(list.x, a, 'when checking head value should return correct value')
  t.same(list.xs, List.Nil, 'when checking value value should return correct value')
  t.same(list.xs.constructor, List, 'constructor on value should refer to TypeRep of the value')
  t.same(list.cata({
    Cons: (x, xs) => [x, xs],
    Nil: () => []
  }), [list.x, list.xs], 'cata should work on Cons')
  t.ok(List.Nil.cata({
    Cons: () => false,
    Nil: () => true
  }), 'cata should work on Nil')
  t.ok(List.is(list), '`is` on type works')
  t.notOk(List.is({}), '`is` on type works')
  t.ok(List.Cons.is(list), '`is` on variant works')
  t.notOk(List.Cons.is(list.xs), '`is` on variant works')
  t.notOk(List.Nil.is(list), '`is` on unit value works')
  t.ok(List.Nil.is(list.xs), '`is` on unit value works')
  t.same(List.prototype.foo, list.foo, 'values in typerep.prototype are accessible from instance values')
  t.same(List.prototype.foo, List.Nil.foo, 'values in typerep.prototype are accessible from instance values')
  t.ok(List.prototype.isPrototypeOf(list), 'prototype chain is correct')
  t.ok(List.prototype.isPrototypeOf(List.Nil), 'prototype chain is correct')
  t.test('build from object', (t) => {
    const list = List.Cons.from({xs: List.Nil, x: a})
    const isList = List.is
    const isCons = List.Cons.is
    /* eslint-disable no-multi-spaces, space-in-parens */
    t.strictSame(     List.is(list), true, '`is` on type works')
    t.strictSame(      isList(list), true, '`is` on type works when unbound')
    t.strictSame(List.Cons.is(list), true, '`is` on variant works')
    t.strictSame(      isCons(list), true, '`is` on variant works when unbound')
    /* eslint-enable no-multi-spaces, space-in-parens */
    t.same(list.x, a, 'head value of list works')
    t.same(list.xs, List.Nil, 'tail value of list works')
    t.throws(
      () => { List.Cons.from({x: 1}) },
      new TypeError('Missing field: xs'),
      'when creating a taggedSum from an object with a missing field'
    )
    t.end()
  })
  t.test('pre-bound .is()', (t) => {
    const tpl = Tuple(a, b)
    const isList = List.is
    const isNil = List.Nil.is
    const nilList = List.Nil
    t.test('typeRep.is() is prebound to the typeRep', (t) => {
      t.doesNotThrow(
        () => { isList(list) },
        'typeRep.is() can be assigned to an unbound var and used separately to test instances'
      )
      t.ok(isList(list), 'typeRep.is() should correctly identify instances even when used as an unbound var')
      t.notOk(isList(tpl), 'typeRep.is() should correctly not identify instances of other types even when used as an unbound var')
      t.end()
    })
    t.test('typeRep.tag.is() is prebound to the tag', (t) => {
      t.doesNotThrow(
        () => { isNil(nilList) },
        'typeRep.tag.is() can be assigned to an unbound var and used separately to test instances'
      )
      t.ok(isNil(nilList), 'typeRep.tag.is() should correctly identify instances even when used as an unbound var')
      t.notOk(isNil(tpl), 'typeRep.tag.is() should correctly not identify instances of other types even when used as an unbound var')
      t.end()
    })
    t.end()
  })
  t.end()
})
