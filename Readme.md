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
  // options
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

## Options for fine control

### schemaUrl

`schemaUrl: 'http://www.people.com/schema'`

### filter

```js
filter: (fields, node, opts) => {
  // list of fields to process
  return []
}
```

### graphId

`graphId: (soul, opts) => id`

### nodeId

By default gets the gun "soul": `Gun.node.soul(nodeObj)`

`nodeId: (nodeObj) => id`

### isNode

By default checks if node has a `_` property

`isNode: (val) => true|false`

### isFirstVisit

By default checks if `opts.visited` is empty

`isFirstVisit: (node, opts) => true|false`

### wasVisited

By default checks if `id` is included in `opts.visited.ids` list

`wasVisited: (id, opts) => true|false`

### visit

By default adds `id` to `opts.visited.ids`

`visit: (id, opts)`

### addContext

By default adds a `@context` property if this is the first node visited
The context is set to `schemaUrl`

`addContext(jsonld, node, opts) => return jsonld`

### buildNode

Builds the base `jsonld` node for this iteration, including `@id` and optional `@context` properties. Also returns the `nodeId`.

`buildNode: (nodeVal, node, opts) => return {jsonld, nodeId}`

### logger

Returns a log function

`logger: (opts) => log function`

### getFields

Gets the list of fields of the node.
By default uses `await node.$fields()` and a special `node._.paths` maintained by utility function `.putAt`

`getFields: (node, opts) => list of fields`


### fullPath

Builds the full path, by default using current `opts.path` and adding the `id`.
Can be used to build the `@context`

`fullPath: (id, opts) => full path`

### prepareOpts

By defaults adds `visited.ids = []` if not yet set (ie, on first node visited)

`prepareOpts: (opts) => prepare opts Object`

### logging

Set to `true` to enable logging


### paths

Set to a list of special paths to iterate on this node (See `putAt` hack above)

## TODO

- Use `chain-gun` and `future-gun` instead of deprecated `gun-edge`
- Use better chaining mechanism, similar to `chain-gun` to avoid importing `Gun`

## Licence

MIT Kristian Mandrup 2017
