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

  function * prunedElements () {
    let i = -1
    cachedPrunedElements = []
    for (const elem of collection) {
      i = i + 1
      let val = elem
      if (typeof property === 'string') val = val && val[property]
      if (typeof val === 'object') val = JSON.stringify(val)
      else if (typeof val !== 'string') continue
      val = { pruned: clean(val), elem }
      cachedPrunedElements[i] = val
      yield val
    }
  }

  return function simpleTextSearch (q) {
    if (!collection || !q) return collection
    const { regex, length } = toRegex(q)
    const result = []
    for (const { pruned, elem } of cachedPrunedElements || prunedElements()) {
      const match = pruned.match(regex)
      if (match && match.length === length) result.push(elem)
    }
    return result
  }
}

function toRegex (str) {
  const content = []
  for (const token of clean(str).split(/\b/)) {
    if (!/\b/.test(token)) continue
    content.push(token.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'))
  }
  return {
    regex: new RegExp(`(${content.join('|')})`, 'ig'),
    length: content.length
  }
}

var replaceChar = charReplacer()
function clean (str) {
  return replaceChar(String(str).toLowerCase())
}

function charReplacer () {
  var charMap = {
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

  Object.keys(charMap).forEach(function (keys) {
    keys.split('').forEach(function (char) {
      charMap[char] = charMap[keys]
    })
  })

  var toReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g')
  function replacer (char) { return charMap[char] || char }
  return function replaceChars (str) {
    return str.replace(toReplace, replacer)
  }
}
