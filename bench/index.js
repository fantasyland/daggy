// ┌────────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────┐
// │ name               │ Old                                          │ New                                          │ win │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.taggedSum     │ 71,315 ops/sec ±3.48% (144 runs sampled)     │ 76,830 ops/sec ±3.07% (147 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.tagged        │ 13,344,969 ops/sec ±0.55% (166 runs sampled) │ 573,216 ops/sec ±1.75% (153 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.taggedSum │ 47,996 ops/sec ±2.90% (151 runs sampled)     │ 49,548 ops/sec ±2.61% (153 runs sampled)     │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ make.new.tagged    │ 110,315 ops/sec ±3.12% (147 runs sampled)    │ 95,723 ops/sec ±2.49% (153 runs sampled)     │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.taggedSum      │ 2,165,148 ops/sec ±0.80% (170 runs sampled)  │ 2,189,430 ops/sec ±0.71% (169 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ new.tagged         │ 2,195,517 ops/sec ±1.20% (167 runs sampled)  │ 2,307,572 ops/sec ±0.66% (170 runs sampled)  │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.taggedSum │ 606,363 ops/sec ±0.58% (169 runs sampled)    │ 572,571 ops/sec ±0.71% (168 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ toString.tagged    │ 412,286 ops/sec ±0.64% (168 runs sampled)    │ 406,783 ops/sec ±0.67% (165 runs sampled)    │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ cata               │ 25,488,200 ops/sec ±0.57% (166 runs sampled) │ 26,720,785 ops/sec ±0.39% (170 runs sampled) │ New │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum     │ 16,274,027 ops/sec ±0.48% (168 runs sampled) │ 15,713,233 ops/sec ±0.39% (168 runs sampled) │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Sum.Tag │ 13,596,912 ops/sec ±0.57% (166 runs sampled) │ 10,909,542 ops/sec ±0.35% (168 runs sampled) │ Old │
// ├────────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────┤
// │ instanceof.Type    │ 14,120,020 ops/sec ±0.79% (162 runs sampled) │ 14,414,014 ops/sec ±0.67% (165 runs sampled) │ New │
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
