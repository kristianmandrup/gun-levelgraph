const levelup = require('levelup')
const levelgraph = require('levelgraph')
const jsonld = require('levelgraph-jsonld')

import {
  toJsonLd
} from './to-jsonld'

import {
  promisify,
  promisify2,
  promisify3
} from './promisify'

const defaultOpts = {
  dbPath: './gundb',
}

const defaultJsonldOpts = {
  base: 'http://gun.io/base'
}

const logger = (opts = {}) => {
  return function log(...args) {
    if (opts.logging) {
      console.log('LvGraph:', ...args)
    }
  }
}

function buildOpts(opts) {
  opts = Object.assign(defaultOpts, opts)

  let jsonldOpts = Object.assign(defaultJsonldOpts, opts.jsonldOpts)

  opts.levelDB = opts.levelDB || levelup(opts.dbPath)
  opts.lvGraphDB = opts.lvGraphDB || levelgraph(opts.levelDB)
  opts.db = opts.db || jsonld(opts.lvGraphDB, jsonldOpts)
  opts.logger = opts.logger || logger
  opts.log = opts.log || opts.logger(opts)

  return opts
}

export function createForLvGraph(_opts) {
  const dbOptions = buildOpts(_opts)
  const db = dbOptions.db
  const jsonld = db.jsonld

  // graphdb.jsonld.put = function(obj, options, callback)
  const lvPut = function (jsonldObj, cb, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    const jsonld = opts.jsonld || db.jsonld

    if (!db) {
      throw new Error('lvPut: no db specified')
    }
    opts.log('lvPut', jsonldObj, opts)
    // graphdb.jsonld.put = function(obj, options, callback)
    db.jsonld.put(jsonldObj, opts, cb)
  }

  //  graphdb.jsonld.put = function(obj, options, callback) {
  const $lvPut = function (jsonld, opts) {
    return promisify2(saveToLvGraph, jsonld, opts)
  }

  // options is optional, otherwise callback is 3rd arg
  // graphdb.jsonld.get = function(iri, context, options, callback) {
  const lvGet = function (iri, context, cb, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    const jsonld = opts.jsonld || db.jsonld

    if (!jsonld) {
      throw new Error('lvGet: no db specified')
    }
    opts.log('lvGet', iri, context, opts)
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.get(iri, context, opts, cb)
  }

  //  graphdb.jsonld.put = function(obj, options, callback) {
  const $lvGet = function (iri, ctx, opts) {
    return promisify3(lvGet, iri, ctx, opts)
  }

  // options is optional, otherwise callback is 2rd arg
  // graphdb.jsonld.del = function(obj, options, callback) {
  const lvDel = function (obj, cb, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    const jsonld = opts.jsonld || db.jsonld

    if (!jsonld) {
      throw new Error('lvDel: no db specified')
    }
    opts.log('lvDel', obj, opts)
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.del(obj, opts, cb)
  }

  //  graphdb.jsonld.put = function(obj, options, callback) {
  const $lvDel = function (obj, opts) {
    return promisify2(lvDel, obj, opts)
  }

  // graphdb.jsonld.cut = function(obj, options, callback) {
  const lvCut = function (obj, cb, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    const jsonld = opts.jsonld || db.jsonld

    if (!jsonld) {
      throw new Error('lvDel: no db specified')
    }
    opts.log('lvCut', obj, opts)
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.del(obj, opts, cb)
  }

  //  graphdb.jsonld.put = function(obj, options, callback) {
  const $lvCut = function (obj, opts) {
    return promisify2(lvDel, obj, opts)
  }

  // options optional
  // See https://github.com/mcollina/levelgraph#limit-and-offset-1
  // db.search(list, options, function(err, solution))
  const lvSearch = function (list, cb, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    if (!db) {
      throw new Error('lvDel: no db specified')
    }
    opts.log('lvSearch', obj, opts)
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    db.search(obj, opts, cb)
  }

  //  graphdb.jsonld.put = function(obj, options, callback) {
  const $lvSearch = function (list, opts) {
    return promisify2(lvSearch, list, opts)
  }

  // options optional
  // See https://github.com/mcollina/levelgraph#limit-and-offset-1
  // db.search(list, options, function(err, solution))
  const lvSearchStream = function (list, opts = {}) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    if (!db) {
      throw new Error('lvDel: no db specified')
    }
    opts.log('lvSearch', obj, opts)
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    return db.searchStream(obj, opts)
  }

  const commands = {
    lvPut,
    $lvPut,
    lvGet,
    $lvGet,
    lvDel,
    $lvDel,
    lvCut,
    $lvCut,
    lvSearch,
    $lvSearch,
    lvSearchStream
  }

  function addLvGraph(chain) {

    async function calcJsonLd(node, opts) {
      let result = await toJsonLd(node, opts.jsonld)
      let {
        json
      } = result
      return json
    }

    function calcGraphNodeId(node, opts) {
      let defaultId = 'gun:' + node.soul(opts)
      return node.graphId ? node.graphId(opts) : defaultId
    }

    function calcGraphNodeCtx(node, opts) {
      let defaultCtx = {
        '@context': 'http://gun.js.org'
      }
      return node.graphCtx ? node.graphCtx(opts) : defaultCtx
    }

    async function getLvGraphNode(node, opts) {
      let graphNode
      graphNode = (typeof this.lvGraphNode === 'function') ? this.lvGraphNode(this) : this.lvGraphNode
      if (graphNode) return graphNode
      let iri = calcGraphNodeId(node, opts)
      let ctx = calcGraphNodeCtx(node, opts)
      if (iri) {
        return await $lvGet(iri, ctx, opts)
      }
    }

    chain.lgPut = async function (cb, opts) {
      let jsonld = await calcJsonLd(this)
      return lvPut(jsonld, cb, opts)
    }

    chain.$lvPut = async function (opts) {
      let jsonld = await calcJsonLd(this)
      return $lvPut(jsonld, opts)
    }

    chain.lgDel = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      let lvObj = getLvGraphNode(this, opts)
      return lvDel(lvObj, cb, opts)
    }

    chain.$lvDel = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      let lvObj = getLvGraphNode(this, opts)
      return $lvDel(lvObj, opts)
    }

    chain.lgCut = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      let lvObj = getLvGraphNode(this, opts)
      return lvCut(lvObj, cb, opts)
    }

    chain.$lvCut = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      let lvObj = getLvGraphNode(this, opts)
      return $lvCut(lvObj, opts)
    }
    return chain
  }

  return {
    addLvGraph,
    commands,
    db,
    jsonld,
    dbOptions
  }
}

export default createForLvGraph