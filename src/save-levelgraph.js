const levelup = require('levelup')
const levelgraph = require('levelgraph')
const jsonld = require('levelgraph-jsonld')
const promisify = require('./promisify')

const defaultOpts = {
  dbPath: './gundb',
  base: 'http://gun.io/base'
}

function buildOpts(_opts) {
  _opts = Object.assign(defaultOpts, _opts)

  _opts.levelDB = _opts.levelDB || levelup(_opts.dbPath)
  _opts.lvGraphDb = _opts.lvGraphDb || levelgraph(_opts.levelDB)
  _opts.db = _opts.db || jsonld(opts.lvGraphDb, opts)
  return _opts
}

export function createSaveToLvGraph(_opts) {
  _opts = buildOpts(_opts)

  return function saveToLvGraph(jsonld, cb, opts) {
    opts = Object.assign(_opts, opts)
    const db = opts.db
    if (!db) {
      throw new Error('saveToLvGraph: missing db option')
    }
    jsonld.put(jsonld, cb, opts)
  }
}

export function saveToLvGraph(jsonld, cb, opts) {
  opts = Object.assign(defaultOpts, opts)
  opts = buildOpts(opts)

  const db = opts.db
  if (!db) {
    throw new Error('saveToLvGraph: missing db option')
  }
  db.jsonld.put(jsonld, cb, opts)
}

export function $saveToLvGraph(jsonld, cb, opts) {
  return promisify(saveToJsonLd, jsonld, opts)
}

export function addSaveToLvGraph(chain) {
  chain.saveToLvGraph = function (cb, opts) {
    return saveToLvGraph(this, cb, opts)
  }

  chain.$saveToLvGraph = function (cb, opts) {
    return $saveToLvGraph(this, cb, opts)
  }

  return chain
}

export default addSaveToJsonLd