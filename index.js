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
  return function simpleTextSearch (q) {
    if (!collection || !q) return collection
    const filter = matches(toQuery(q), property)
    const result = []
    for (const elem of collection) if (filter(elem)) result.push(elem)
    return result
  }
}

function toQuery (str) {
  return clean(str)
    .split(/\b/)
    .filter(function (token) {
      return /\b/.test(token)
    })
}

function matches (query, prop) {
  return function filter (val) {
    if (typeof prop === 'string') val = val && val[prop]
    if (typeof val === 'object') val = JSON.stringify(val)
    if (typeof val !== 'string') return false

    for (var i = 0; i < query.length; i++) {
      if (!~clean(val).indexOf(query[i])) {
        return false
      }
    }

    return true
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
