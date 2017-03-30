const levelup = require('levelup')
const levelgraph = require('levelgraph')
const jsonld = require('levelgraph-jsonld')

import {
  promisify,
  promisifyWithOpts
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
      console.log('toLdGraph:', ...args)
    }
  }
}

function buildOpts(opts) {
  opts = Object.assign(defaultOpts, opts)

  let jsonldOpts = Object.assign(defaultJsonldOpts, opts.jsonldOpts)

  opts.levelDB = opts.levelDB || levelup(opts.dbPath)
  opts.lvGraphDb = opts.lvGraphDb || levelgraph(opts.levelDB)

  console.log('jsonld db', jsonldOpts)
  opts.db = opts.db || jsonld(opts.lvGraphDb, jsonldOpts)
  opts.logger = opts.logger || logger
  opts.log = opts.log || opts.logger(opts)

  return opts
}

export function createSaveToLvGraph(_opts) {
  let dbOptions = buildOpts(_opts)

  const saveToLvGraph = function (jsonld, cb, opts) {
    opts = Object.assign(dbOptions, opts)
    const db = opts.db
    if (!db) {
      throw new Error('saveToLvGraph: missing db option')
    }
    opts.log('put', db.jsonld, jsonld)
    db.jsonld.put(jsonld, cb, opts)
  }

  const $saveToLvGraph = function (jsonld, opts) {
    opts = Object.assign(dbOptions, opts)
    return promisify(saveToLvGraph, jsonld, opts)
  }

  const dbGet = dbOptions.db.jsonld.get

  const $dbGet = function (queryId, queryOpts) {
    return promisifyWithOpts(dbGet, queryId, queryOpts)
  }

  return {
    dbGet,
    $dbGet,
    dbOptions,
    saveToLvGraph,
    $saveToLvGraph
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
  return promisify(saveToLvGraph, jsonld, opts)
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

export default addSaveToLvGraph