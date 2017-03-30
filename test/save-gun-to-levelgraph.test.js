import test from 'ava'

import {
  createSaveToLvGraph
} from '../src/save-levelgraph'

import {
  sampleGunToJsonLd
} from './util/jsonld'

test('save Gun graph to LvGraph', async t => {
  let jsonld = await sampleGunToJsonLd()

  // TODO:
  // Fix addContext and graphId functions to:
  //   add valid @context on each node
  //   add valid @id on each node

  console.log('jsonld', jsonld)

  let {
    dbGet,
    saveToLvGraph
  } = createSaveToLvGraph()

  saveToLvGraph(jsonld, function (err, obj) {
    if (err) {
      throw err
    }
    // do something after the obj is inserted
    console.log('PUT mark', obj)
    t.is(obj.name, 'mark')
  });

  dbGet(jsonld['@id'], {
    '@context': jsonld['@context']
  }, function (err, obj) {
    if (err) {
      throw err
    }
    t.is(obj.name, 'mark')
    // obj will be the very same of the manu object
    console.log('GET mark', obj)
  });
})