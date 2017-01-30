// ┌────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────┬─────┐
// │ name               │ Old                                         │ New                                         │ win │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 68,773 ops/sec ±5.09% (57 runs sampled)     │ 91,492 ops/sec ±7.40% (56 runs sampled)     │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 4,647,722 ops/sec ±2.75% (84 runs sampled)  │ 12,033,801 ops/sec ±1.19% (88 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 45,922 ops/sec ±5.23% (63 runs sampled)     │ 54,014 ops/sec ±5.40% (61 runs sampled)     │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 98,360 ops/sec ±3.59% (69 runs sampled)     │ 114,486 ops/sec ±4.12% (69 runs sampled)    │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 168,905 ops/sec ±5.06% (74 runs sampled)    │ 2,105,842 ops/sec ±1.65% (86 runs sampled)  │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 177,197 ops/sec ±4.53% (76 runs sampled)    │ 2,071,908 ops/sec ±1.21% (84 runs sampled)  │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 16,561,138 ops/sec ±1.06% (86 runs sampled) │ 1,100,323 ops/sec ±1.56% (85 runs sampled)  │ Old │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 20,193,656 ops/sec ±0.96% (85 runs sampled) │ 865,854 ops/sec ±1.38% (84 runs sampled)    │ Old │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ cata               │ 11,137,895 ops/sec ±1.17% (86 runs sampled) │ 24,559,425 ops/sec ±0.97% (89 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 7,912,219 ops/sec ±1.19% (88 runs sampled)  │ 15,726,130 ops/sec ±0.98% (86 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 7,654,017 ops/sec ±0.85% (89 runs sampled)  │ 12,543,413 ops/sec ±1.02% (89 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 7,874,982 ops/sec ±0.92% (86 runs sampled)  │ 14,838,948 ops/sec ±1.00% (87 runs sampled) │ New │
// └────────────────────┴─────────────────────────────────────────────┴─────────────────────────────────────────────┴─────┘
require('./lib')({
  'make.taggedSum': {
    Old: ({ taggedSum, ListDef }) => taggedSum(ListDef),
    New: ({ taggedSum, ListDef }) => taggedSum('List', ListDef)
  },
  'make.tagged': {
    Old: ({ tagged, TupleDef }) => tagged(TupleDef[0], TupleDef[1]),
    New: ({ tagged, TupleDef }) => tagged('Tuple', TupleDef)
  },
  'make.new.taggedSum': {
    Old: ({ taggedSum, ListDef }) => taggedSum(ListDef).Cons(1, 2),
    New: ({ taggedSum, ListDef }) => taggedSum('List', ListDef).Cons(1, 2)
  },
  'make.new.tagged': {
    Old: ({ tagged, TupleDef }) => tagged(TupleDef[0], TupleDef[1])(1, 2),
    New: ({ tagged, TupleDef }) => tagged('Tuple', TupleDef)(1, 2)
  },
  'new.taggedSum': {
    Old: ({ List }) => List.Cons('1', List.Nil),
    New: ({ List }) => List.Cons('1', List.Nil)
  },
  'new.tagged': {
    Old: ({ Tuple }) => Tuple(1, 2),
    New: ({ Tuple }) => Tuple(1, 2)
  },
  'toString.taggedSum': {
    Old: ({ list }) => list.toString(),
    New: ({ list }) => list.toString()
  },
  'toString.tagged': {
    Old: ({ tuple }) => tuple.toString(),
    New: ({ tuple }) => tuple.toString()
  },
  'cata': {
    Old: ({ list, pattern }) => list.cata(pattern),
    New: ({ list, pattern }) => list.cata(pattern)
  },
  'instanceof.Sum': {
    Old: ({ list, List }) => list instanceof List,
    New: ({ list, List }) => List.is(list)
  },
  'instanceof.Sum.Tag': {
    Old: ({ list, List }) => list instanceof List.Cons,
    New: ({ list, List }) => List.Cons.is(list)
  },
  'instanceof.Type': {
    Old: ({ tuple, Tuple }) => tuple instanceof Tuple,
    New: ({ tuple, Tuple }) => Tuple.is(tuple)
  }
})
