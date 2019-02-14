// ┌────────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────┐
// │ name               │ Old                                          │ New                                          │ win │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 125,547 ops/sec ±2.88% (144 runs sampled)    │ 126,888 ops/sec ±2.95% (140 runs sampled)    │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 903,920 ops/sec ±3.57% (153 runs sampled)    │ 889,371 ops/sec ±3.73% (152 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 80,258 ops/sec ±1.97% (149 runs sampled)     │ 78,150 ops/sec ±2.15% (146 runs sampled)     │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 179,896 ops/sec ±2.60% (145 runs sampled)    │ 179,003 ops/sec ±2.21% (144 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 2,488,771 ops/sec ±0.42% (170 runs sampled)  │ 2,246,936 ops/sec ±1.91% (162 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 2,512,948 ops/sec ±0.50% (171 runs sampled)  │ 2,269,092 ops/sec ±2.42% (162 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 1,787,871 ops/sec ±0.38% (171 runs sampled)  │ 1,717,636 ops/sec ±0.43% (170 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 1,434,933 ops/sec ±0.68% (172 runs sampled)  │ 1,432,805 ops/sec ±0.28% (171 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata               │ 32,679,682 ops/sec ±0.37% (171 runs sampled) │ 13,896,988 ops/sec ±0.47% (170 runs sampled) │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata.giant         │ 12,877,269 ops/sec ±0.51% (170 runs sampled) │ 4,063,503 ops/sec ±0.45% (171 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 13,899,352 ops/sec ±0.48% (170 runs sampled) │ 9,174,012 ops/sec ±0.31% (172 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 8,666,474 ops/sec ±0.75% (168 runs sampled)  │ 8,824,885 ops/sec ±0.41% (171 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 8,372,620 ops/sec ±0.49% (169 runs sampled)  │ 7,603,899 ops/sec ±0.45% (167 runs sampled)  │ Old │
// └────────────────────┴──────────────────────────────────────────────┴──────────────────────────────────────────────┴─────┘
require('./lib')({
  'make.taggedSum': {
    Old: ({ taggedSum, ListDef }) => taggedSum('List', ListDef),
    New: ({ taggedSum, ListDef }) => taggedSum('List', ListDef)
  },
  'make.tagged': {
    Old: ({ tagged, TupleDef }) => tagged('Tuple', TupleDef),
    New: ({ tagged, TupleDef }) => tagged('Tuple', TupleDef)
  },
  'make.new.taggedSum': {
    Old: ({ taggedSum, ListDef }) => taggedSum('List', ListDef).Cons(1, 2),
    New: ({ taggedSum, ListDef }) => taggedSum('List', ListDef).Cons(1, 2)
  },
  'make.new.tagged': {
    Old: ({ tagged, TupleDef }) => tagged('Tuple', TupleDef)(1, 2),
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
  'cata.giant': {
    Old: ({ giant, giantPattern }) => giant.cata(giantPattern),
    New: ({ giant, giantPattern }) => giant.cata(giantPattern)
  },
  'instanceof.Sum': {
    Old: ({ list, List }) => List.is(list),
    New: ({ list, List }) => List.is(list)
  },
  'instanceof.Sum.Tag': {
    Old: ({ list, List }) => List.Cons.is(list),
    New: ({ list, List }) => List.Cons.is(list)
  },
  'instanceof.Type': {
    Old: ({ tuple, Tuple }) => Tuple.is(tuple),
    New: ({ tuple, Tuple }) => Tuple.is(tuple)
  }
})
