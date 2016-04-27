# simple-text-search

## Usage

```
  var filter = require('simple-text-search')
  var get = filter(['foo', 'bar', 'foobar'])
  var results = get('foo')
  // -> returns ['foo', 'foobar']
```

 Objects in a collection get stringified. So all properties get filtered.
 You can also define a property to filter in:
 ```
   var cities = [{id: 1, name: 'Zürich'}, {id: 2, name: 'Reykjavík'}]
   var get = filter(cities, 'name')
   var results = get('zurich')
   // -> returns [{name: 'Zürich'}]
 ```

This module doesn't do any stemming except replacing umlauts.


## Alternatives

Please use [sifter](https://github.com/brianreavis/sifter.js) if you need sorting or scoring.
