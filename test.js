var assert = require('assert')
var search = require('./')

// Returns matches
var get = search(['foo', 'bar', 'foobar'])
var res = get('foo')
assert.equal(res[0], 'foo')
assert.equal(res[1], 'foobar')
assert.equal(res.length, 2)

// Matches whole object and returns same object instances
var arr2 = [{id: 1, name: 'Test'}, {id: 2, name: 'Marc'}]
var get2 = search(arr2)
var res2 = get2('test')

assert.equal(res2[0], arr2[0])
assert.equal(res2.length, 1)

res2 = get2(1)
assert.equal(res2[0], arr2[0])
assert.equal(res2.length, 1)

res2 = get2(2)
assert.equal(res2[0], arr2[1])
assert.equal(res2.length, 1)

// Allows to restrict search one property
var arr3 = [{id: 1, name: 'Test'}, {id: 2, name: 'Marc'}]
var get3 = search(arr3, 'name')
var res3 = get3('Marc')
assert.equal(res3[0], arr3[1])
assert.equal(res3.length, 1)

res3 = get3(2)
assert.equal(res3.length, 0)

// Search using umlauts is supported
var arr4 = [{id: 1, name: 'Zürich'}, {id: 2, name: 'Reykjavík'}]
var get4 = search(arr4, 'name')
var res4 = get4('zurich')
assert.equal(res4[0], arr4[0])
assert.equal(res4.length, 1)

res4 = get4('reykjavik')
assert.equal(res4[0], arr4[1])
assert.equal(res4.length, 1)