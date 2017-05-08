// ┌────────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────┐
// │ name               │ Old                                          │ New                                          │ win │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 57,619 ops/sec ±2.94% (142 runs sampled)     │ 82,565 ops/sec ±3.34% (148 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 4,017,995 ops/sec ±0.59% (166 runs sampled)  │ 748,941 ops/sec ±1.95% (147 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 39,169 ops/sec ±2.49% (149 runs sampled)     │ 45,729 ops/sec ±3.21% (147 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 80,241 ops/sec ±2.65% (148 runs sampled)     │ 107,022 ops/sec ±2.56% (152 runs sampled)    │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 136,723 ops/sec ±2.24% (157 runs sampled)    │ 2,143,255 ops/sec ±0.22% (170 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 141,371 ops/sec ±2.06% (157 runs sampled)    │ 2,146,960 ops/sec ±0.96% (166 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 775,561 ops/sec ±1.53% (166 runs sampled)    │ 577,119 ops/sec ±0.85% (166 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 831,722 ops/sec ±0.69% (165 runs sampled)    │ 412,569 ops/sec ±0.60% (169 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata               │ 12,936,203 ops/sec ±0.79% (167 runs sampled) │ 5,641,587 ops/sec ±0.67% (167 runs sampled)  │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 34,357,819 ops/sec ±0.83% (170 runs sampled) │ 16,843,774 ops/sec ±0.59% (163 runs sampled) │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 34,802,271 ops/sec ±0.70% (169 runs sampled) │ 13,393,576 ops/sec ±0.46% (168 runs sampled) │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 35,181,773 ops/sec ±0.81% (167 runs sampled) │ 14,266,497 ops/sec ±1.30% (160 runs sampled) │ Old │
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
