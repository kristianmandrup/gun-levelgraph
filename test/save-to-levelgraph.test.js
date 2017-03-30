import test from 'ava'

import {
  createSaveToLvGraph
} from '../src/save-levelgraph'

var manu = {
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
};

var jsonld = {
  manu
}

test('saveToLvGraph', async t => {
  let {
    dbGet,
    saveToLvGraph
  } = createSaveToLvGraph()

  saveToLvGraph(jsonld.manu, function (err, obj) {
    if (err) {
      throw err
    }
    // do something after the obj is inserted
    console.log('PUT manu', obj)
    t.is(obj.name, 'http://xmlns.com/foaf/0.1/name')
    t.is(obj.homepage, 'http://manu.sporny.org/')
  });

  dbGet(jsonld.manu['@id'], {
    '@context': jsonld.manu['@context']
  }, function (err, obj) {
    if (err) {
      throw err
    }
    t.is(obj.name, 'http://xmlns.com/foaf/0.1/name')
    t.is(obj.homepage, 'http://manu.sporny.org/')
    // obj will be the very same of the manu object
    console.log('GET manu', obj)
  });
})