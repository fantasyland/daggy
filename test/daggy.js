const { toString } = require('sanctuary-type-classes')
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
  t.same(tpl.toString(), `Tuple(${toString(a)}, ${toString(b)})`, 'toString on value should work')
  t.same(Tuple.toString(), `Tuple`, 'toString on type should work')
  t.same(tpl._1, a, 'when checking _1 value should return correct value')
  t.same(tpl._2, b, 'when checking _2 value should return correct value')
  t.same(tpl.constructor, Tuple, 'constructor on value should refer to TypeRep of the value')
  t.ok(Tuple.is(tpl), '`is` on type works')
  t.notOk(Tuple.is({}), '`is` on type works')
  t.same(Tuple.prototype.foo, tpl.foo, 'values in typerep.prototype are accassible from instance values')
  t.ok(Tuple.prototype.isPrototypeOf(tpl), 'prototype chain is correct')
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
    new Error(`Constructors given to cata didn't include: Nil`),
    'throws if all cases are not handled'
  )
  t.throws(
    () => { list.cata({}) },
    new Error(`Constructors given to cata didn't include: Cons`),
    'throws if all cases are not handled'
  )
  t.same(list.toString(), `List.Cons(${toString(a)}, List.Nil)`, 'toString on value should work')
  t.same(List.toString(), 'List', 'toString on type should work')
  t.same(List.Cons.toString(), 'List.Cons', 'toString on variant constructor should work')
  t.same(List.Nil.toString(), 'List.Nil', 'toString on unit variant should work')
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
  t.same(List.prototype.foo, list.foo, 'values in typerep.prototype are accassible from instance values')
  t.same(List.prototype.foo, List.Nil.foo, 'values in typerep.prototype are accassible from instance values')
  t.ok(List.prototype.isPrototypeOf(list), 'prototype chain is correct')
  t.ok(List.prototype.isPrototypeOf(List.Nil), 'prototype chain is correct')
  t.end()
})
