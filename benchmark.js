const bench = require('nanobench')
const createSearch = require('./')
let count = 1000
const largeArray = []
const hashes = { 1: 'foo', 2: 'foo bar', 3: 'hello', 4: 'world', 5: 'baz qux' }
while (count--) largeArray.push(`aaaaaaaaaaaaaaaaaaa${hashes[count] || ''}`)

bench('instantiate 1000000 times', function (b) {
  b.start()

  for (let i = 0; i < 1000000; i++) {
    createSearch(largeArray)
  }

  b.end()
})

const search = createSearch(largeArray)
bench('search 10000 times', function (b) {
  b.start()

  for (let i = 0; i < 10000; i++) {
    search('foo bar baz qux')
  }

  b.end()
})
