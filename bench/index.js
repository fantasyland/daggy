// ┌────────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────┐
// │ name               │ Old                                          │ New                                          │ win │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 65,866 ops/sec ±3.14% (139 runs sampled)     │ 105,602 ops/sec ±3.90% (137 runs sampled)    │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 5,148,109 ops/sec ±0.76% (166 runs sampled)  │ 14,507,700 ops/sec ±1.22% (168 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 39,454 ops/sec ±3.32% (142 runs sampled)     │ 61,228 ops/sec ±3.20% (138 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 79,335 ops/sec ±3.09% (140 runs sampled)     │ 127,639 ops/sec ±2.78% (147 runs sampled)    │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 118,931 ops/sec ±2.96% (150 runs sampled)    │ 2,250,639 ops/sec ±0.74% (164 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 125,774 ops/sec ±2.58% (151 runs sampled)    │ 2,228,629 ops/sec ±1.49% (161 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 1,461,954 ops/sec ±1.15% (160 runs sampled)  │ 1,296,122 ops/sec ±1.16% (162 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 1,353,424 ops/sec ±1.30% (162 runs sampled)  │ 994,847 ops/sec ±0.98% (164 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata               │ 12,170,946 ops/sec ±1.29% (162 runs sampled) │ 24,312,870 ops/sec ±1.15% (157 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 7,721,688 ops/sec ±0.87% (158 runs sampled)  │ 14,665,784 ops/sec ±1.14% (156 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 7,771,570 ops/sec ±0.88% (157 runs sampled)  │ 12,798,153 ops/sec ±1.26% (159 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 8,273,334 ops/sec ±1.01% (162 runs sampled)  │ 13,940,120 ops/sec ±0.93% (162 runs sampled) │ New │
// └────────────────────┴──────────────────────────────────────────────┴──────────────────────────────────────────────┴─────┘
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
