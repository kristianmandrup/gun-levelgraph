'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createForLvGraph = createForLvGraph;

var _toJsonld = require('./to-jsonld');

var _promisify = require('./promisify');

var levelup = require('levelup');
var levelgraph = require('levelgraph');
var jsonld = require('levelgraph-jsonld');

var defaultOpts = {
  dbPath: './gundb'
};

var defaultJsonldOpts = {
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

      (_console = console).log.apply(_console, ['LvGraph:'].concat(args));
    }
  };
};

function buildOpts(opts) {
  opts = Object.assign(defaultOpts, opts);

  var jsonldOpts = Object.assign(defaultJsonldOpts, opts.jsonldOpts);

  opts.levelDB = opts.levelDB || levelup(opts.dbPath);
  opts.lvGraphDB = opts.lvGraphDB || levelgraph(opts.levelDB);
  opts.db = opts.db || jsonld(opts.lvGraphDB, jsonldOpts);
  opts.logger = opts.logger || logger;
  opts.log = opts.log || opts.logger(opts);

  return opts;
}

function createForLvGraph(_opts) {
  var dbOptions = buildOpts(_opts);
  var db = dbOptions.db;
  var jsonld = db.jsonld;

  // graphdb.jsonld.put = function(obj, options, callback)
  var lvPut = function lvPut(jsonldObj, cb) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    var jsonld = opts.jsonld || db.jsonld;

    if (!db) {
      throw new Error('lvPut: no db specified');
    }
    opts.log('lvPut', jsonldObj, opts);
    // graphdb.jsonld.put = function(obj, options, callback)
    db.jsonld.put(jsonldObj, opts, cb);
  };

  //  graphdb.jsonld.put = function(obj, options, callback) {
  var $lvPut = function $lvPut(jsonld, opts) {
    return (0, _promisify.promisify2)(saveToLvGraph, jsonld, opts);
  };

  // options is optional, otherwise callback is 3rd arg
  // graphdb.jsonld.get = function(iri, context, options, callback) {
  var lvGet = function lvGet(iri, context, cb) {
    var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    var jsonld = opts.jsonld || db.jsonld;

    if (!jsonld) {
      throw new Error('lvGet: no db specified');
    }
    opts.log('lvGet', iri, context, opts);
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.get(jsonld, context, opts, cb);
  };

  //  graphdb.jsonld.put = function(obj, options, callback) {
  var $lvGet = function $lvGet(iri, ctx, opts) {
    return (0, _promisify.promisify3)(lvGet, iri, ctx, opts);
  };

  // options is optional, otherwise callback is 2rd arg
  // graphdb.jsonld.del = function(obj, options, callback) {
  var lvDel = function lvDel(obj, cb) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    var jsonld = opts.jsonld || db.jsonld;

    if (!jsonld) {
      throw new Error('lvDel: no db specified');
    }
    opts.log('lvDel', obj, opts);
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.del(obj, opts, cb);
  };

  //  graphdb.jsonld.put = function(obj, options, callback) {
  var $lvDel = function $lvDel(obj, opts) {
    return (0, _promisify.promisify2)(lvDel, obj, opts);
  };

  // graphdb.jsonld.cut = function(obj, options, callback) {
  var lvCut = function lvCut(obj, cb) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    var jsonld = opts.jsonld || db.jsonld;

    if (!jsonld) {
      throw new Error('lvDel: no db specified');
    }
    opts.log('lvCut', obj, opts);
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    jsonld.del(obj, opts, cb);
  };

  //  graphdb.jsonld.put = function(obj, options, callback) {
  var $lvCut = function $lvCut(obj, opts) {
    return (0, _promisify.promisify2)(lvDel, obj, opts);
  };

  // options optional
  // See https://github.com/mcollina/levelgraph#limit-and-offset-1
  // db.search(list, options, function(err, solution))
  var lvSearch = function lvSearch(list, cb) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    if (!db) {
      throw new Error('lvDel: no db specified');
    }
    opts.log('lvSearch', obj, opts);
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    db.search(obj, opts, cb);
  };

  //  graphdb.jsonld.put = function(obj, options, callback) {
  var $lvSearch = function $lvSearch(list, opts) {
    return (0, _promisify.promisify2)(lvSearch, list, opts);
  };

  // options optional
  // See https://github.com/mcollina/levelgraph#limit-and-offset-1
  // db.search(list, options, function(err, solution))
  var lvSearchStream = function lvSearchStream(list) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    opts = Object.assign(dbOptions, opts);
    var db = opts.db;
    if (!db) {
      throw new Error('lvDel: no db specified');
    }
    opts.log('lvSearch', obj, opts);
    // graphdb.jsonld.get = function(iri, context, options, callback) {
    return db.searchStream(obj, opts);
  };

  var commands = {
    lvPut: lvPut,
    $lvPut: $lvPut,
    lvGet: lvGet,
    $lvGet: $lvGet,
    lvDel: lvDel,
    $lvDel: $lvDel,
    lvCut: lvCut,
    $lvCut: $lvCut,
    lvSearch: lvSearch,
    $lvSearch: $lvSearch,
    lvSearchStream: lvSearchStream
  };

  function addLvGraph(chain) {

    async function calcJsonLd(node, opts) {
      var result = await (0, _toJsonld.toJsonLd)(node, opts.jsonld);
      var json = result.json;

      return json;
    }

    function calcGraphNodeId(node, opts) {
      var defaultId = 'gun:' + node.soul(opts);
      return node.graphId ? node.graphId(opts) : defaultId;
    }

    function calcGraphNodeCtx(node, opts) {
      var defaultCtx = {
        '@context': 'http://gun.js.org'
      };
      return node.graphCtx ? node.graphCtx(opts) : defaultCtx;
    }

    async function getLvGraphNode(node, opts) {
      var graphNode = void 0;
      graphNode = typeof this.lvGraphNode === 'function' ? this.lvGraphNode(this) : this.lvGraphNode;
      if (graphNode) return graphNode;
      var iri = calcGraphNodeId(node, opts);
      var ctx = calcGraphNodeCtx(node, opts);
      if (iri) {
        return await $lvGet(iri, ctx, opts);
      }
    }

    chain.lgPut = async function (cb, opts) {
      var jsonld = await calcJsonLd(this);
      return lvPut(jsonld, cb, opts);
    };

    chain.$lvPut = async function (opts) {
      var jsonld = await calcJsonLd(this);
      return $lvPut(jsonld, opts);
    };

    chain.lgDel = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      var lvObj = getLvGraphNode(this, opts);
      return lvDel(lvObj, cb, opts);
    };

    chain.$lvDel = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      var lvObj = getLvGraphNode(this, opts);
      return $lvDel(lvObj, opts);
    };

    chain.lgCut = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      var lvObj = getLvGraphNode(this, opts);
      return lvCut(lvObj, cb, opts);
    };

    chain.$lvCut = function (cb, opts) {
      // it needs to either cache a ref to the lvGraph node
      // or call get with the @id first, before calling del
      var lvObj = getLvGraphNode(this, opts);
      return $lvCut(lvObj, opts);
    };
    return chain;
  }

  return {
    addLvGraph: addLvGraph,
    commands: commands,
    db: db,
    jsonld: jsonld,
    dbOptions: dbOptions
  };
}

exports.default = createForLvGraph;
//# sourceMappingURL=levelgraph.js.map
