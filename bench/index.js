// ┌────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────┬─────┐
// │ name               │ Old                                         │ New                                         │ win │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 81,109 ops/sec ±4.50% (61 runs sampled)     │ 134,303 ops/sec ±5.25% (65 runs sampled)    │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 4,774,099 ops/sec ±1.70% (87 runs sampled)  │ 1,387,310 ops/sec ±1.21% (87 runs sampled)  │ Old │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 50,862 ops/sec ±3.06% (66 runs sampled)     │ 77,225 ops/sec ±5.72% (69 runs sampled)     │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 113,074 ops/sec ±4.01% (69 runs sampled)    │ 122,710 ops/sec ±4.05% (72 runs sampled)    │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 191,770 ops/sec ±4.82% (74 runs sampled)    │ 1,386,128 ops/sec ±1.73% (88 runs sampled)  │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 213,000 ops/sec ±4.17% (77 runs sampled)    │ 2,531,701 ops/sec ±0.70% (89 runs sampled)  │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 20,492,392 ops/sec ±1.23% (90 runs sampled) │ 1,280,764 ops/sec ±1.18% (91 runs sampled)  │ Old │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 23,179,852 ops/sec ±1.00% (87 runs sampled) │ 1,014,941 ops/sec ±1.12% (91 runs sampled)  │ Old │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ cata               │ 14,553,989 ops/sec ±1.04% (91 runs sampled) │ 27,933,332 ops/sec ±1.07% (91 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 8,649,283 ops/sec ±1.53% (89 runs sampled)  │ 13,078,767 ops/sec ±1.62% (86 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 7,883,633 ops/sec ±0.91% (84 runs sampled)  │ 13,502,152 ops/sec ±1.09% (84 runs sampled) │ New │
// ├────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 8,113,769 ops/sec ±1.01% (86 runs sampled)  │ 12,202,704 ops/sec ±1.17% (84 runs sampled) │ New │
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
