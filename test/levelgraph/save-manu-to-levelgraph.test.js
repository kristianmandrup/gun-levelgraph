import test from 'ava'
import createForLvGraph from '../../src/levelgraph'

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

var manuComplex = {
  "@context": {
    "@vocab": "http://xmlns.com/foaf/0.1/",
    "homepage": {
      "@type": "@id"
    },
    "knows": {
      "@type": "@id"
    },
    "based_near": {
      "@type": "@id"
    }
  },
  "@id": "http://manu.sporny.org#person",
  "name": "Manu Sporny",
  "homepage": "http://manu.sporny.org/",
  "knows": [{
    "@id": "https://my-profile.eu/people/deiu/card#me",
    "name": "Andrei Vlad Sambra",
    "based_near": "http://dbpedia.org/resource/Paris"
  }, {
    "@id": "http://melvincarvalho.com/#me",
    "name": "Melvin Carvalho",
    "based_near": "http://dbpedia.org/resource/Honolulu"
  }, {
    "@id": "http://bblfish.net/people/henry/card#me",
    "name": "Henry Story",
    "based_near": "http://dbpedia.org/resource/Paris"
  }, {
    "@id": "http://presbrey.mit.edu/foaf#presbrey",
    "name": "Joe Presbrey",
    "based_near": "http://dbpedia.org/resource/Cambridge"
  }]
};

let {
  commands
} = createForLvGraph()
let {
  lvGet,
  lvPut
} = commands
console.log('commands', commands)

function doQuery(id, ctx, t) {
  console.log('doQuery', id, ctx, lvGet)
  // lvGet = function (iri, context, cb, opts = {})
  lvGet(id, ctx, function (err, obj) {
    if (err) {
      throw err
    }
    console.log('GOT manu', obj)

    t.is(obj.name, "Manu Sporny")
    t.is(obj.homepage, 'http://manu.sporny.org/')
    t.end()
  });
}

test.cb('saveToLvGraph', t => {
  let node = manuComplex

  lvPut(node, function (err, obj) {
    if (err) {
      throw err
    }
    // do something after the obj is inserted
    console.log('PUT manu', obj)
    t.is(obj.name, "Manu Sporny")
    t.is(obj.homepage, 'http://manu.sporny.org/')

    let id = node['@id']
    let ctx = {
      '@context': node['@context']
    }
    console.log('query', id, ctx)
    // perform query on same node
    try {
      doQuery(id, ctx, t)
    } catch (err) {
      console.error(err)
      throw err
    }
  });
})