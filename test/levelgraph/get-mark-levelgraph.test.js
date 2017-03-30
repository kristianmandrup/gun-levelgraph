import test from 'ava'

import {
  createSaveToLvGraph,
  $saveToLvGraph
} from '../../src/save-levelgraph'

let sampleJson = `{
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
}`

let sampleManu = `{
  "@context": {
    "name": "http://xmlns.com/foaf/0.1/name",
    "homepage": {
      "@id": "http://xmlns.com/foaf/0.1/homepage",
      "@type": "@id"
    }
  },
  "@id": "http://manu.sporny.org#person",
  "name": "Manu Sporny",
  "homepage": "http://manu.sporny.org/"
}`

var manu = sampleManu

var levelup = require("levelup"),
  yourDB = levelup("./gundb"),
  levelgraph = require('levelgraph'),
  jsonld = require('levelgraph-jsonld'),
  opts = {
    base: 'http://matteocollina.com/base'
  },
  db = jsonld(levelgraph(yourDB), opts);

test.cb('get Manu', t => {
  let {
    dbGet
  } = createSaveToLvGraph()

  let myGet = db.jsonld.get
  console.log('dbGet', dbGet, myGet)

  myGet(manu['@id'], {
    '@context': manu['@context']
  }, function (err, obj) {
    if (err) {
      throw err
    }
    console.log('GOT manu', obj)

    t.is(obj.name, 'http://xmlns.com/foaf/0.1/name')
    t.is(obj.homepage, 'http://manu.sporny.org/')
    t.end()
  });
})