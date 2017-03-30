import test from 'ava'

import {
  createSaveToLvGraph,
  $saveToLvGraph
} from '../src/save-levelgraph'

import {
  sampleGunToJsonLd
} from './util/jsonld'

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

function makeQuery(dbGet, {
  queryId,
  context,
  t
}) {
  console.log('makeQuery')
  let opts = {
    '@context': context
  }

  dbGet(queryId, opts, function (err, obj) {
    if (err) {
      throw err
    }
    console.log('GET mark', queryId, obj)

    if (obj) {
      t.is(obj.name, 'mark')
    } else {
      throw new Error(`No object found for ${queryId}`)
    }
  });
}


test('save Gun graph to LvGraph', async t => {
  let jsonld = await sampleGunToJsonLd()

  // TODO:
  // Fix addContext and graphId functions to:
  //   add valid @context on each node
  //   add valid @id on each node

  console.log('jsonld', jsonld)

  let {
    dbGet,
    saveToLvGraph,
    $saveToLvGraph
  } = createSaveToLvGraph()

  let queryId = jsonld['@id']
  let context = jsonld['@context']

  console.log('save', jsonld)
  try {
    let result = await $saveToLvGraph(jsonld)
    // do something after the obj is inserted
    if (!result) {
      throw 'no result'
    }

    console.log('mark was PUT', result)
    t.is(result.name, 'mark')

    makeQuery(dbGet, {
      queryId,
      context,
      t
    })

  } catch (err) {
    console.log('save err', err)
    throw err
  }
})