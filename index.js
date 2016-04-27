module.exports = search

// Usage:
//  ```
//    var get = search(['foo', 'bar', 'foobar'])
//    var results = get('foo')
//    // -> returns ['foo', 'foobar']
//  ```
//
//  Objects in a collection get stringified to search it.
//  You can also define a property to search in:
//  ```
//    var get = serach([{name: 'Zürich'}, {name: 'Marc'}], 'name')
//    var results = get('zurich')
//    // -> returns [{name: 'Marc'}]
//  ```
function search (collection, property) {
  return function (q) {
    if (!collection) return collection
    return collection.filter(matches(toQuery(q), property))
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
  return function (val) {
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
    'äàáâäæãåā': 'a',
    'çćč': 'c',
    'đð': 'd',
    'èéêëēėę': 'e',
    'îïíīįì': 'i',
    'ł': 'l',
    'ñńň': 'n',
    'ôöòóœøōõ': 'o',
    'ř': 'r',
    'śš': 's',
    'ß': 'ss',
    'ť': 't',
    'ûüùúūů': 'u',
    'ÿý': 'y',
    'žżŻź': 'z'
  }

  Object.keys(charMap).forEach(function (keys) {
    keys.split('').forEach(function (char) {
      charMap[char] = charMap[keys]
    })
  })

  var toReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g')
  function replaceChar (char) { return charMap[char] || char }
  return function replaceChars (str) {
    return str.replace(toReplace, replaceChar)
  }
}
