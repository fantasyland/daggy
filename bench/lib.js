const Table = require('cli-table')
const colors = require('colors/safe')
const benchmark = require('benchmark')
const daggyNew = require('../src/daggy.js')
const daggyOld = require('daggy')

const TupleDef = ['_1', '_2']
const ListDef = {
  Cons: ['x', 'xs'],
  Nil: []
}
const GiantDef = {
  V0: [],
  V1: ['a'],
  V2: ['a', 'b'],
  V3: ['a', 'b', 'c'],
  V4: ['a', 'b', 'c', 'd'],
  V5: ['a', 'b', 'c', 'd', 'e'],
  V6: ['a', 'b', 'c', 'd', 'e', 'f'],
  V7: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  V8: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  V9: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
}

const TupleOld = daggyOld.tagged('Tuple', TupleDef)
const ListOld = daggyOld.taggedSum('List', ListDef)
const GiantOld = daggyOld.taggedSum('Giant', GiantDef)
const listOld = ListOld.Cons(1, ListOld.Nil)
const tupleOld = TupleOld(1, 2)
const giantOld = GiantOld.V1(1)

const TupleNew = daggyNew.tagged('Tuple', TupleDef)
const ListNew = daggyNew.taggedSum('List', ListDef)
const GiantNew = daggyNew.taggedSum('Giant', GiantDef)
const listNew = ListNew.Cons(1, ListNew.Nil)
const tupleNew = TupleNew(1, 2)
const giantNew = GiantNew.V1(1)

const pattern = {
  Cons: (x, xs) => 1,
  Nil: () => 0
}

const giantPattern = {
  V0: () => 0,
  V1: () => 1,
  V2: () => 2,
  V3: () => 3,
  V4: () => 4,
  V5: () => 5,
  V6: () => 6,
  V7: () => 7,
  V8: () => 8,
  V9: () => 9
}

const defEnv = {
  ListDef,
  TupleDef,
  pattern,
  giantPattern
}
const env = {
  Old: Object.assign({}, defEnv, {
    tuple: tupleOld,
    Tuple: TupleOld,
    List: ListOld,
    list: listOld,
    taggedSum: daggyOld.taggedSum,
    tagged: daggyOld.tagged,
    giant: giantOld
  }),
  New: Object.assign({}, defEnv, {
    tuple: tupleNew,
    Tuple: TupleNew,
    List: ListNew,
    list: listNew,
    taggedSum: daggyNew.taggedSum,
    tagged: daggyNew.tagged,
    giant: giantNew
  })
}

module.exports = (specs) => {
  const table = new Table({
    head: ['name', 'Old', 'New', 'win']
  })
  Object.keys(specs).forEach((name) => {
    console.log(`START: ${name}`)
    const suite = new benchmark.Suite(name)
    const spec = specs[name]
    suite.add('Old', { minSamples: 80, fn: () => spec.Old(env.Old) })
    suite.add('New', { minSamples: 80, fn: () => spec.New(env.New) })
    suite.on('complete', function () {
      const fast = this.filter('fastest')[0]
      const row = [name]
      for (let i = 0; i < this.length; i++) {
        // 6 is length of prefix `New x `
        const str = this[i].toString().slice(6)
        if (this[i] === fast) {
          row.push(colors.green(str))
        } else {
          row.push(colors.red(str))
        }
      }
      row.push(fast.name)
      table.push(row)
    })
    suite.run()
  })

  console.log(table.toString())
}
