# gun-levelgraph

Interop layer between [Gun](gun.js.org) and [LevelGraph](https://github.com/mcollina/levelgraph) via [levelgraph-jsonld](https://github.com/mcollina/levelgraph-jsonld)

Uses [gun-edge](https://github.com/kristianmandrup/gun-edge) internally

## Status

WIP

## Install

```bash
npm i -S gun-levelgraph
```

## Goals

```js
  let daniele = gun.get('person/daniele').put({
    name: 'daniele'
    gender: 'female'
  })

  let mark = gun.get('mark/person').put({
    name: 'mark',
    gender: 'male'
    knows: daniele
  })

  let triplets = await gun.get('mark').toTriplets()
  console.log(triplets)
```

Output something like this:

```js
{
  "@id": "person/mark",
  "name": "mark",
  "gender": "male",
  "knows": [{
    "@id": "person/daniele",
    "name": "Daniele"
    "gender": "female",
  }]
}
```

Which can then be saved to LevelGraph

```js
db.jsonld.put(triplets, function(err, obj) {
  console.log('SAVED', obj)
}
```

## Usage

TODO

## Licence

MIT Kristian Mandrup 2017
