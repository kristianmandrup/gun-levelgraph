# gun-levelgraph

Interop layer between [Gun](gun.js.org) and [LevelGraph](https://github.com/mcollina/levelgraph) via [levelgraph-jsonld](https://github.com/mcollina/levelgraph-jsonld)

## Status

Conversion to JsonLd format is super flexible and works!
See *Todo* at the bottom for the roadmap. Please help out ;)

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

## Licence

MIT Kristian Mandrup 2017
