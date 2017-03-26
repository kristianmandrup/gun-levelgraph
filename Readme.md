# gun-levelgraph

Interop layer between [Gun](gun.js.org) and [LevelGraph](https://github.com/mcollina/levelgraph) via [levelgraph-jsonld](https://github.com/mcollina/levelgraph-jsonld)

Uses [gun-edge](https://github.com/kristianmandrup/gun-edge) internally

## Status

WIP

## Install

```bash
npm i -S gun-levelgraph
```

## Usage

```js
let mark = gun.get('mark')
let amber = gun.get('amber')

amber.put({
  name: 'amber',
  gender: 'female'
})

mark.put({
  name: 'mark',
  gender: 'male',
})

// mark.path('wife').put(amber)
mark.putAt('wife', amber)

// mark.path('self').put(mark)
mark.putAt('self', mark)

let val = await mark.$value()
console.log('mark', val)

let jsonld = await mark.$toJsonLd({
  // Note:
  //   each node using putAt to add path nodes
  //   will contain paths list in metadata
  // paths: ['wife', 'self']
})
console.log('JSONLD', jsonld)
t.is(jsonld.name, 'mark')
t.is(jsonld.wife.name, 'amber')
```

Outputs:

```js
mark
{ name: 'mark',
  gender: 'male',
  wife: { '#': 'amber' },
  self: { '#': 'mark' } }

JSONLD
{ '@id': 'mark',
  name: 'mark',
  gender: 'male',
  wife: { '@id': 'amber', name: 'amber', gender: 'female' },
  self: { '@id': 'mark' } }
```

Note that it detects circular references and for such nodes already visited, it only
returns the `@id` reference.

The JsonLD JSON object can then be saved to LevelGraph

```js
db.jsonld.put(jsonld, function(err, obj) {
  console.log('SAVED', obj)
}
```

## Licence

MIT Kristian Mandrup 2017
