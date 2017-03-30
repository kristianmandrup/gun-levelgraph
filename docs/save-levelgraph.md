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
  createSaveToLvGraph
} from 'gun-levelgraph'

let defaultOpts = {
  // dbPath: './gundb',
  // base: 'http://gun.io/base'
  // levelDB: leveldb instance
  // lvGraphDb: levelgraph instance
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
let saveToLevelGraph = createSaveToLvGraph(defaultOpts)

saveToLevelGraph(jsonld, saveCb)

// to override your default options
saveToLevelGraph(jsonld, saveCb, {
  // your overrides for this execution context
})
```

### Utility functions

```js
import { $saveToLvGraph } from 'gun-levelgraph'

let result = await $saveToLvGraph(jsonld, opts)
```

### Chaining setup

```js
import chain from 'gun-levelgraph'
chain(Gun)

// alternatively
import { addSaveToLvGraph } from 'gun-levelgraph'
addSaveToLvGraph(Gun.chain)

let result = await jsonld.$saveToLvGraph(opts)
```

## Run Tests

`npm i -g ava`

Try `ava test/save-to-levelgraph.test.js`

## License

MIT Kristian Mandrup 2017


