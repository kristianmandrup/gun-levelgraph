# gun-levelgraph

Interop layer between [Gun](gun.js.org) and [LevelGraph](https://github.com/mcollina/levelgraph) via [levelgraph-jsonld](https://github.com/mcollina/levelgraph-jsonld)

## Status

Conversion to JsonLd format is super flexible and works!

The following default functions need to be fixed however:

- Make default `addContext` and `graphId` functions:
  - add valid JsonLd `@context` on each node
  - add valid JsonLd `@id` on each node

## Install

```bash
npm i -S gun-levelgraph
```

## Usage

See docs:

- [to-jsonld](https://github.com/kristianmandrup/gun-levelgraph/blob/master/docs/to-jsonld.md)
- [save-levelgraph](https://github.com/kristianmandrup/gun-levelgraph/blob/master/docs/save-levelgraph.md)

## Gun utility functions

More Gun chain utility functions are available via:

- [chain-gun](https://github.com/kristianmandrup/chain-gun) - misc
- [future-gun](https://github.com/kristianmandrup/future-gun) - Promise
- [water-gun](https://github.com/kristianmandrup/water-gun) - Observable/CSP

## Run Tests

`npm i -g ava`

Try `ava test`

## TODO

- Test LevelGraph save functions
- Load JsonLd object into Gun graph for a full cycle

### Save Gun node to LevelGraph

- Fix `addContext` and `graphId` functions to:
  - add valid JsonLd `@context` on each node
  - add valid JsonLd `@id` on each node

## Licence

MIT Kristian Mandrup 2017
