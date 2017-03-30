'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSaveToLvGraph = createSaveToLvGraph;
exports.saveToLvGraph = saveToLvGraph;
exports.$saveToLvGraph = $saveToLvGraph;
exports.addSaveToLvGraph = addSaveToLvGraph;
var levelup = require('levelup');
var levelgraph = require('levelgraph');
var jsonld = require('levelgraph-jsonld');
var promisify = require('./promisify');

var defaultOpts = {
  dbPath: './gundb',
  base: 'http://gun.io/base'
};

function buildOpts(opts) {
  opts = Object.assign(defaultOpts, opts);

  opts.levelDB = opts.levelDB || levelup(opts.dbPath);
  opts.lvGraphDb = opts.lvGraphDb || levelgraph(opts.levelDB);
  opts.db = opts.db || jsonld(opts.lvGraphDb, opts);
  return opts;
}

function createSaveToLvGraph(_opts) {
  var dbOptions = buildOpts(_opts);

  var saveToLvGraph = function saveToLvGraph(jsonld, cb, opts) {
    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    if (!db) {
      throw new Error('saveToLvGraph: missing db option');
    }
    db.jsonld.put(jsonld, cb, opts);
  };

  return {
    dbGet: dbOptions.db.jsonld.get,
    dbOptions: dbOptions,
    saveToLvGraph: saveToLvGraph
  };
}

function saveToLvGraph(jsonld, cb, opts) {
  opts = Object.assign(defaultOpts, opts);
  opts = buildOpts(opts);

  var db = opts.db;
  if (!db) {
    throw new Error('saveToLvGraph: missing db option');
  }
  db.jsonld.put(jsonld, cb, opts);
}

function $saveToLvGraph(jsonld, cb, opts) {
  return promisify(saveToJsonLd, jsonld, opts);
}

function addSaveToLvGraph(chain) {
  chain.saveToLvGraph = function (cb, opts) {
    return saveToLvGraph(this, cb, opts);
  };

  chain.$saveToLvGraph = function (cb, opts) {
    return $saveToLvGraph(this, cb, opts);
  };

  return chain;
}

exports.default = addSaveToLvGraph;
//# sourceMappingURL=save-levelgraph.js.map
