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
  // schemaUrl: 'http://www.people.com/schema'
  // filter: (fields, node, opts) => fields to process
  // graphId: (soul, opts) => id

  // Note:
  //   each node using putAt to add path nodes
  //   will contain paths list in metadata, ie. _.paths
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
{
  "@context": "http://schema.org/",
  "@id": "#mark",
  "name": "mark",
  "gender": "male",
  "wife": {
    "@id": "#amber",
    "name": "amber",
    "gender": "female"
  },
  "self": {
    "@id": "#mark"
  }
}
```

Note that it detects circular references and for such nodes already visited, it only returns the `@id` reference.

The triples for that look like this:

```
<mark> <gender> "male" .
<mark> <name> "mark" .
<mark> <self> <mark> .
```

Triples are just sentences (conceptually): `Subject`, `Predicate`, `Object`.
Here's some valid JSON-LD (adds a `@context`) in the [JSON-LD Playground](http://json-ld.org/playground/#startTab=tab-normalized&json-ld=%7B%22%40context%22%3A%22http%3A%2F%2Fschema.org%2F%22%2C%22%40id%22%3A%22%23mark%22%2C%22name%22%3A%22mark%22%2C%22gender%22%3A%22male%22%2C%22self%22%3A%7B%22%40id%22%3A%22%23mark%22%7D%7D&context=%7B%7D) to play with.

The JsonLD JSON object can then be saved to LevelGraph

```js
db.jsonld.put(jsonld, function(err, obj) {
  console.log('SAVED', obj)
}
```

## Licence

MIT Kristian Mandrup 2017
