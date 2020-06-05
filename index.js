module.exports = prepareSimpleTextSearch

// Usage:
//  ```
//    var get = simpleTextSearch(['foo', 'bar', 'foobar'])
//    var results = get('foo')
//    // -> returns ['foo', 'foobar']
//  ```
//
//  Objects in a collection get stringified to search it.
//  You can also define a property to search in:
//  ```
//    var get = simpleTextSearch([{name: 'Zürich'}, {name: 'Marc'}], 'name')
//    var results = get('zurich')
//    // -> returns [{name: 'Marc'}]
//  ```
function prepareSimpleTextSearch (collection, property) {
  let cachedPrunedElements

  function prunedElements () {
    const elements = []
    for (const elem of collection) {
      let val = elem
      if (typeof property === 'string') val = val && val[property]
      if (typeof val === 'object') val = JSON.stringify(val)
      else if (typeof val !== 'string') continue
      val = { pruned: clean(val), elem }
      elements.push(val)
    }
    cachedPrunedElements = elements
    return cachedPrunedElements
  }

  return function simpleTextSearch (q) {
    if (!collection || !q) return collection
    const tokens = clean(q).split(/\W/)
    const result = []

    // eslint-disable-next-line no-labels
    entries: for (const { pruned, elem } of cachedPrunedElements || prunedElements()) {
      let i = tokens.length
      // eslint-disable-next-line no-labels
      while (i--) if (pruned.indexOf(tokens[i]) === -1) continue entries
      result.push(elem)
    }
    return result
  }
}

const specialCharMap = {
  äàáâäæãåā: 'a',
  çćč: 'c',
  đð: 'd',
  èéêëēėę: 'e',
  îïíīįì: 'i',
  ł: 'l',
  ñńň: 'n',
  ôöòóœøōõ: 'o',
  ř: 'r',
  śš: 's',
  ß: 'ss',
  ť: 't',
  ûüùúūů: 'u',
  ÿý: 'y',
  žżŻź: 'z'
}

const charMap = {}
for (const keys of Object.keys(specialCharMap)) {
  for (const char of keys) {
    charMap[char] = specialCharMap[keys]
  }
}

const toReplace = new RegExp('[' + Object.keys(charMap).join('') + ']|\\W+', 'g')
function replacer (char) { return charMap[char] || ' ' }

function clean (str) {
  return String(str).toLowerCase().replace(toReplace, replacer).trim()
}
