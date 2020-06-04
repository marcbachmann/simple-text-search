const assert = require('assert')
const search = require('./')

// Returns matches
const get = search(['foo', 'bar', 'foobar'])
const res = get('foo')
assert.strictEqual(res[0], 'foo')
assert.strictEqual(res[1], 'foobar')
assert.strictEqual(res.length, 2)

// Matches whole object and returns same object instances
const arr2 = [{ id: 1, name: 'Test' }, { id: 2, name: 'Marc' }]
const get2 = search(arr2)
const res2a = get2('test')

assert.strictEqual(res2a[0], arr2[0])
assert.strictEqual(res2a.length, 1)

const res2b = get2(1)
assert.strictEqual(res2b[0], arr2[0])
assert.strictEqual(res2b.length, 1)

const res2c = get2(2)
assert.strictEqual(res2c[0], arr2[1])
assert.strictEqual(res2c.length, 1)

// Allows to restrict search one property
const arr3 = [{ id: 1, name: 'Test' }, { id: 2, name: 'Marc' }]
const get3 = search(arr3, 'name')
const res3a = get3('Marc')
assert.strictEqual(res3a[0], arr3[1])
assert.strictEqual(res3a.length, 1)

const res3b = get3(2)
assert.strictEqual(res3b.length, 0)

// Search using umlauts is supported
const arr4 = [{ id: 1, name: 'Zürich' }, { id: 2, name: 'Reykjavík' }]
const get4 = search(arr4, 'name')
const res4a = get4('zurich')
assert.strictEqual(res4a[0], arr4[0])
assert.strictEqual(res4a.length, 1)

const res4b = get4('reykjavik')
assert.strictEqual(res4b[0], arr4[1])
assert.strictEqual(res4b.length, 1)

const res4c = get4('zu rich')
assert.strictEqual(res4c[0], arr4[0])
assert.strictEqual(res4c.length, 1)

const res4d = get4('zu reyk')
assert.strictEqual(res4d.length, 0)

const arr5 = ['Sidra Trabanco', 'Sidra Trabanco Selección', 'Sidra iSidra', 'Sidra Acebal']
const get5 = search(arr5)
const res5a = get5('Sidra Trabanco')
assert.strictEqual(res5a.length, 2)
assert.strictEqual(res5a[0], arr5[0])
assert.strictEqual(res5a[1], arr5[1])

const res5b = get5('Sidra')
assert.strictEqual(res5b.length, arr5.length)
