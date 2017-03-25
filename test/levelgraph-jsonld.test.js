import test from 'ava'

import {
  db
} from '../src/levelgraph'

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

test('saveTriplets', async t => {
  db.jsonld.put(manu, function (err, obj) {
    // do something after the obj is inserted
    console.log('PUT manu', obj)
  });

  db.jsonld.get(manu['@id'], {
    '@context': manu['@context']
  }, function (err, obj) {
    // obj will be the very same of the manu object
    console.log('GET manu', obj)
  });
})