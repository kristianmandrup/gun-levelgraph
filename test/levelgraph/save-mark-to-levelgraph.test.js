import test from 'ava'

import {
  createSaveToLvGraph
} from '../../src/save-levelgraph'

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

let mark = {
  "@context": "http://schema.org/",
  "@id": ":mark",
  "name": "mark",
}

let mark1 = {
  "@context": {
    "@vocab": "http://xmlns.com/foaf/0.1/",
    "name": "http://xmlns.com/foaf/0.1/name",
    "gender": "http://xmlns.com/foaf/0.1/gender",
    "wife": "http://xmlns.com/foaf/0.1/wife"
  },
  "@id": "person:mark",
  "name": "mark",
  "gender": "male",
  "wife": {
    "@id": "person:amber",
    "name": "amber",
    "gender": "female"
  }
}

let mark2 = {
  "@context": "http://www.schema.org",
  "@id": "http://www.schema.org/mark",
  "name": "mark",
  "gender": "male",
  "wife": {
    "@id": "http://www.schema.org/amber",
    "name": "amber",
    "gender": "female"
  }
}

let mark3 = {
  "@context": "http://www.schema.org",
  "@id": "http://www.schema.org/mark",
  "name": "mark",
  "gender": "male",
  "wife": {
    "@id": "http://www.schema.org/amber",
    "name": "amber",
    "gender": "female"
  },
  "self": {
    "@id": "http://www.schema.org/mark",
    "@type": "@id"
  }
}


let {
  dbGet,
  saveToLvGraph
} = createSaveToLvGraph()


function doQuery(id, queryOpts, t) {
  dbGet(id, queryOpts, function (err, obj) {
    if (err) {
      throw err
    }
    console.log('GOT mark', obj)

    t.is(obj.name, "mark")
    t.end()
  });
}

test.cb('saveToLvGraph', t => {
  let node = mark1

  saveToLvGraph(node, function (err, obj) {
    if (err) {
      throw err
    }
    // do something after the obj is inserted
    console.log('mark was PUT', obj)
    t.is(obj.name, "mark")

    let id = obj['@id']
    let queryOpts = {
      '@context': obj['@context']
    }
    console.log('query', id, queryOpts)

    // perform query on same node
    try {
      doQuery(id, queryOpts, t)
    } catch (err) {
      console.error(err)
      throw err
    }
  });
})