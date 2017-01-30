// ┌────────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────┐
// │ name               │ Old                                          │ New                                          │ win │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 70,474 ops/sec ±4.07% (156 runs sampled)     │ 95,305 ops/sec ±3.52% (154 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 4,615,592 ops/sec ±1.14% (183 runs sampled)  │ 12,392,364 ops/sec ±0.88% (180 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 45,260 ops/sec ±3.23% (160 runs sampled)     │ 54,729 ops/sec ±3.36% (160 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 102,921 ops/sec ±2.60% (166 runs sampled)    │ 119,925 ops/sec ±2.73% (164 runs sampled)    │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 173,492 ops/sec ±3.15% (168 runs sampled)    │ 2,112,523 ops/sec ±0.74% (183 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 182,019 ops/sec ±2.91% (170 runs sampled)    │ 2,219,063 ops/sec ±0.74% (182 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 18,536,134 ops/sec ±0.75% (183 runs sampled) │ 1,131,245 ops/sec ±0.79% (181 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 19,679,083 ops/sec ±0.83% (183 runs sampled) │ 874,721 ops/sec ±1.05% (181 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata               │ 12,136,956 ops/sec ±0.88% (182 runs sampled) │ 24,992,698 ops/sec ±1.00% (179 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 7,755,705 ops/sec ±0.60% (184 runs sampled)  │ 15,095,599 ops/sec ±0.68% (181 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 7,549,688 ops/sec ±0.72% (182 runs sampled)  │ 12,294,435 ops/sec ±0.72% (179 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 7,636,000 ops/sec ±0.66% (183 runs sampled)  │ 10,546,841 ops/sec ±0.61% (184 runs sampled) │ New │
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
