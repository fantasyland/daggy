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

const TupleOld = daggyOld.tagged('Tuple', TupleDef)
const ListOld = daggyOld.taggedSum('List', ListDef)
const listOld = ListOld.Cons(1, ListOld.Nil)
const tupleOld = TupleOld(1, 2)

const TupleNew = daggyNew.tagged('Tuple', TupleDef)
const ListNew = daggyNew.taggedSum('List', ListDef)
const listNew = ListNew.Cons(1, ListNew.Nil)
const tupleNew = TupleNew(1, 2)

const pattern = {
  Cons: (x, xs) => 1,
  Nil: () => 0
}

const defEnv = {
  ListDef,
  TupleDef,
  pattern
}
const env = {
  Old: Object.assign({}, defEnv, {
    tuple: tupleOld,
    Tuple: TupleOld,
    List: ListOld,
    list: listOld,
    taggedSum: daggyOld.taggedSum,
    tagged: daggyOld.tagged
  }),
  New: Object.assign({}, defEnv, {
    tuple: tupleNew,
    Tuple: TupleNew,
    List: ListNew,
    list: listNew,
    taggedSum: daggyNew.taggedSum,
    tagged: daggyNew.tagged
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
