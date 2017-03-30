'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSaveToLvGraph = createSaveToLvGraph;
exports.saveToLvGraph = saveToLvGraph;
exports.$saveToLvGraph = $saveToLvGraph;
exports.addSaveToLvGraph = addSaveToLvGraph;

var _promisify = require('./promisify');

var _promisify2 = _interopRequireDefault(_promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levelup = require('levelup');
var levelgraph = require('levelgraph');
var jsonld = require('levelgraph-jsonld');

var defaultOpts = {
  dbPath: './gundb',
  base: 'http://gun.io/base'
};

var logger = function logger() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function log() {
    if (opts.logging) {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['toLdGraph:'].concat(args));
    }
  };
};

function buildOpts(opts) {
  opts = Object.assign(defaultOpts, opts);

  opts.levelDB = opts.levelDB || levelup(opts.dbPath);
  opts.lvGraphDb = opts.lvGraphDb || levelgraph(opts.levelDB);
  opts.db = opts.db || jsonld(opts.lvGraphDb, opts);
  opts.logger = opts.logger || logger;
  opts.log = opts.log || opts.logger(opts);

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
    opts.log('put', db.jsonld, jsonld);
    db.jsonld.put(jsonld, cb, opts);
  };

  var $saveToLvGraph = function $saveToLvGraph(jsonld, cb, opts) {
    opts = Object.assign(dbOptions, opts);
    return (0, _promisify2.default)(saveToLvGraph, jsonld, opts);
  };

  return {
    dbGet: dbOptions.db.jsonld.get,
    dbOptions: dbOptions,
    saveToLvGraph: saveToLvGraph,
    $saveToLvGraph: $saveToLvGraph
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
  return (0, _promisify2.default)(saveToLvGraph, jsonld, opts);
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
