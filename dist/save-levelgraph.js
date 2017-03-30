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

function buildOpts(_opts) {
  _opts = Object.assign(defaultOpts, _opts);

  _opts.levelDB = _opts.levelDB || levelup(_opts.dbPath);
  _opts.lvGraphDb = _opts.lvGraphDb || levelgraph(_opts.levelDB);
  _opts.db = _opts.db || jsonld(opts.lvGraphDb, opts);
  return _opts;
}

function createSaveToLvGraph(_opts) {
  _opts = buildOpts(_opts);

  return function saveToLvGraph(jsonld, cb, opts) {
    opts = Object.assign(_opts, opts);
    var db = opts.db;
    if (!db) {
      throw new Error('saveToLvGraph: missing db option');
    }
    jsonld.put(jsonld, cb, opts);
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

exports.default = addSaveToJsonLd;
//# sourceMappingURL=save-levelgraph.js.map
