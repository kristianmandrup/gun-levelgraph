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

mark.path('wife').put(amber)

let val = await mark.$value()
console.log('mark', val)

let jsonld = await mark.$toJsonLd({
  paths: ['wife']
})
console.log(jsonld)
t.is(jsonld.name, 'mark')
t.is(jsonld.wife.name, 'amber')
```

Outputs:

```js
{ '@id': 'mark',
  name: 'mark',
  gender: 'male',
  wife: {
    '@id': 'amber',
    name: 'amber',
    gender: 'female'
  }
}
```

Which can then be saved to LevelGraph

```js
db.jsonld.put(jsonld, function(err, obj) {
  console.log('SAVED', obj)
}
```

## Licence

MIT Kristian Mandrup 2017
