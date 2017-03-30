'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFunctions = createFunctions;
exports.toLdGraph = toLdGraph;
exports.toJsonLd = toJsonLd;
exports.addToJsonLd = addToJsonLd;

var _gun = require('gun/gun');

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function nodeId(nodeObj) {
  return _gun2.default.node.soul(nodeObj);
}

function isNode(val, opts) {
  return val._;
}

function wasVisited(id, opts) {
  var ids = opts.visited.ids;
  opts.log('visited ids', ids, '==', id);
  return ids.indexOf(id) >= 0;
}

function visit(id, opts) {
  opts.visited.ids.push(id);
}

function addContext(jsonld, node, opts) {
  if (!isFirstVisit(node, opts)) return jsonld;

  var context = opts.schemaUrl || 'http://schema.org/';
  opts.log('root node:', context);
  jsonld['@context'] = context;
  return jsonld;
}

async function getFields(node, opts) {
  var fields = await node.$fields();
  var nodePaths = opts.paths || [];
  nodePaths = nodePaths.concat(node._.paths || []);

  if (nodePaths) {
    fields = fields.concat(nodePaths);
  }

  var uniqFields = [].concat(_toConsumableArray(new Set(fields)));

  if (opts.filter) {
    uniqFields = opts.filter(uniqFields, node, opts);
  }
  return uniqFields;
}

var isFirstVisit = function isFirstVisit(node, opts) {
  return !opts.visited || opts.visited.ids.length === 0;
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

var buildNode = function buildNode(nodeVal, node, opts) {
  var jsonld = {};

  // if context node
  jsonld = opts.addContext(jsonld, node, opts);

  var nodeId = opts.nodeId(nodeVal);
  opts.log('node id:', nodeId);

  var id = opts.graphId(nodeId, opts);
  jsonld['@id'] = id;

  return {
    jsonld: jsonld,
    nodeId: nodeId
  };
};

var graphId = function graphId(id) {
  return '#' + id;
};

function addDefaultOpts(opts) {
  opts = Object.assign({
    isFirstVisit: isFirstVisit,
    wasVisited: wasVisited,
    visit: visit,
    addContext: addContext,
    graphId: graphId,
    isNode: isNode,
    buildNode: buildNode,
    logger: logger,
    nodeId: nodeId,
    getFields: getFields,
    fullPath: fullPath,
    iterateFields: iterateFields,
    nodeValue: nodeValue,
    recurseField: recurseField,
    prepareOpts: prepareOpts
  }, opts);

  opts.log = opts.log || opts.logger(opts);
  return opts;
}

var defaultOpts = {};

function createFunctions(opts) {
  defaultOpts = addDefaultOpts(opts);
  return {
    toLdGraph: toLdGraph,
    toJsonLd: toJsonLd
  };
}

var fullPath = function fullPath(id, opts) {
  var path = (opts.path || '') + '/' + id;
  delete opts.path;
  return path;
};

var prepareOpts = function prepareOpts(opts) {
  opts.visited = opts.visited || {
    ids: []
  };
  return opts;
};

async function recurseField(field, node, fullPath, opts) {
  opts.log('recurse', field);
  var fieldNode = node.path(field);
  opts.path = fullPath + '/' + field;
  opts.parentNode = node;
  return await toLdGraph(fieldNode, opts);
}

async function iterateFields(jsonld, node, nodeId, opts) {
  var fullPath = opts.fullPath(nodeId, opts);

  var fields = await opts.getFields(node, opts);

  opts.log('parse fields', fields);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      jsonld[field] = await opts.recurseField(field, node, fullPath, opts);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return jsonld;
}

async function nodeValue(node) {
  return await node.$val();
}

async function toLdGraph(node) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  opts = Object.assign(addDefaultOpts(defaultOpts), opts);
  var log = opts.log;

  var nodeVal = await opts.nodeValue(node);

  if (!opts.isNode(nodeVal)) {
    log('field', nodeVal);
    return nodeVal;
  }

  var _opts$buildNode = opts.buildNode(nodeVal, node, opts),
      jsonld = _opts$buildNode.jsonld,
      nodeId = _opts$buildNode.nodeId;

  log('build node', jsonld);
  opts.$id = jsonld['@id'];

  opts = opts.prepareOpts(opts);

  if (opts.wasVisited(nodeId, opts)) {
    log('already visited:', jsonld);
    return jsonld;
  }

  opts.visit(nodeId, opts);

  jsonld = await opts.iterateFields(jsonld, node, nodeId, opts);

  log('jsonld:', jsonld);
  return jsonld;
}

async function toJsonLd(node) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var result = await toLdGraph(node, opts = {});
  return {
    result: result,
    json: JSON.stringify(result, null, opts.spacer || 2)
  };
}

function addToJsonLd(chain) {
  chain.$toJsonLd = function (opts) {
    return toJsonLd(this, opts);
  };

  chain.$toLdGraph = function (opts) {
    return toLdGraph(this, opts);
  };

  return chain;
}

exports.default = addToJsonLd;
//# sourceMappingURL=to-jsonld.js.map
