# Save JsonLd to LevelGraph

Store your JsonLd object in LevelGraph as triplets!

## Usage

- factory
- utility
- Gun chain

### Factory function

```js
import {
  // factory
  createAll
} from 'gun-levelgraph'

let defaultOpts = {
  // dbPath: './gundb',

  // jsonldOpts: {
  //   base: 'http://gun.io/base'
  // },

  // levelDB: leveldb instance
  // lvGraphDB: levelgraph instance
  // db: levelgraph-jsonld instance
}

// callback for DB save operation
const saveCb = (err, obj) => {
  if (err) {
    // handle error
  }
  console.log('SAVED in LevelGraph', obj)
}

// create functions with default options that suit your needs
let { commands } = createAll(defaultOpts)
```

### lvPut

Put a valid JsonLd object into LevelGraph datastore as a set of triplets.

```js
let { lvPut } = commands

lvPut(jsonld, saveCb)

// to override your default options
lvPut(jsonld, saveCb, {
  // your overrides for this execution context
})
```

### lvGet

Get a LevelGraph object from store by IRI (unique id)

```js
let { lvGet } = commands

lvGet(iri, ctx, getCb)

// to override your default options
lvGet(iri, ctx, getCb, {
  // your overrides for this execution context
})
```


### Async commands

```js
let { $lvPut } = commands

try {
  let result = await $lvPut(jsonld, opts)
  // ...
} catch (err) {
  // handle put error
}

```

### Chaining setup

```js
import { createForLvGraph } from 'gun-levelgraph'
let {
  addLvGraph
} = createForLvGraph(opts)
addLvGraph(Gun.chain)
try {
  // put a gun node directly!
  // will first attempt to convert it to jsonld :)
  let result = await node.$lvPut(opts)
  // ...
} catch (err) {
  // handle put error
}
```

## Run Tests

`npm i -g ava`

Try `ava test/levelgraph/save-to-levelgraph.test.js`

## License

MIT Kristian Mandrup 2017


