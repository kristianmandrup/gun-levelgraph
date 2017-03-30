# gun-levelgraph

Interop layer between [Gun](gun.js.org) and [LevelGraph](https://github.com/mcollina/levelgraph) via [levelgraph-jsonld](https://github.com/mcollina/levelgraph-jsonld)

## Status

Conversion to JsonLd format is super flexible and works!

The following default functions need to be fixed however:

- Tweak default `addContext`, `graphId` and `referenceNode` functions:
  - add valid JsonLd `@context` on each node
  - add valid JsonLd `@id` on each node
  - make sure valid references

## Install

```bash
npm i -S gun-levelgraph
```

## Usage

See docs:

- [to-jsonld](https://github.com/kristianmandrup/gun-levelgraph/blob/master/docs/to-jsonld.md)
- [save-levelgraph](https://github.com/kristianmandrup/gun-levelgraph/blob/master/docs/save-levelgraph.md)

## FAQ

A lot of useful insight can be gathered from answers to my questions on this [levelgraph-jsonld issue](https://github.com/mcollina/levelgraph-jsonld/issues/62)

How it will help you as well!

Some helpful resources:

- [levelgraph searches](https://github.com/mcollina/levelgraph#searches)
- [levelgraph playground](https://wileylabs.github.io/levelgraph-playground/)
- [jsonld playground](http://json-ld.org/playground/)

## Db errors & locks

_The locking error is because levelup is not multi user by default. So indeed you must have another process with the db opened. As long as you don't have important data in it then deleting is an option. Killing zombie processes which might have the file locked is another (maybe best to take the habit of doing that instead of a delete...)._

## Debugging

When debugging it's useful to see what LevelGraph directly returns (after putting with `db.json.ld.put()`) using : `db.get({}, console.log);`

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
