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

var defaultCtx = function defaultCtx(opts) {
  return {
    '@vocab': opts.schemaUrl
  };
};

function addContext(jsonld, node, opts) {
  if (!isFirstVisit(node, opts)) return jsonld;

  var nodeCtx = node.context ? node.context() : false;
  var context = nodeCtx || opts.context || defaultCtx(opts);
  opts.log('context:', context);
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

  var fullPath = opts.buildfullPath(nodeId, opts);

  var id = opts.graphId(nodeId, fullPath, opts);
  jsonld['@id'] = id;

  return {
    jsonld: jsonld,
    nodeId: nodeId,
    fullPath: fullPath
  };
};

var graphId = function graphId(id, fullPath, opts) {
  return [opts.schemaUrl, id].join('/');
};

function addDefaultOpts(opts) {
  opts = Object.assign({
    schemaUrl: 'http://xmlns.com/foaf/0.1',
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
    buildfullPath: buildfullPath,
    iterateFields: iterateFields,
    nodeValue: nodeValue,
    recurseField: recurseField,
    fieldValue: fieldValue,
    referenceNode: referenceNode,
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

var buildfullPath = function buildfullPath(id, opts) {
  var path = opts.path ? [opts.path, id].join('/') : id;
  delete opts.path;
  return path;
};

var prepareOpts = function prepareOpts(opts) {
  opts.visited = opts.visited || {
    ids: []
  };
  return opts;
};

async function recurseField(field, node, opts) {
  opts.log('recurse', field);
  var fieldNode = node.path(field);
  opts.path = opts.fullPath + '/' + field;
  opts.parentNode = node;
  return await toLdGraph(fieldNode, opts);
}

async function iterateFields(jsonld, node, nodeId, opts) {
  var fields = await opts.getFields(node, opts);

  opts.log('parse fields', fields);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      jsonld[field] = await opts.recurseField(field, node, opts);
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

var referenceNode = function referenceNode(jsonld, opts) {
  jsonld['@type'] = '@id';
  return jsonld;
};

var fieldValue = function fieldValue(val) {
  return val;
};

async function toLdGraph(node) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  opts = Object.assign(addDefaultOpts(defaultOpts), opts);
  var log = opts.log;

  var nodeVal = await opts.nodeValue(node);

  if (!opts.isNode(nodeVal)) {
    log('field', nodeVal);
    return opts.fieldValue(nodeVal, opts);
  }

  var _opts$buildNode = opts.buildNode(nodeVal, node, opts),
      jsonld = _opts$buildNode.jsonld,
      fullPath = _opts$buildNode.fullPath,
      nodeId = _opts$buildNode.nodeId;

  opts.fullPath = fullPath;

  log('build node', jsonld);
  opts.$id = jsonld['@id'];

  opts = opts.prepareOpts(opts);

  if (opts.wasVisited(nodeId, opts)) {
    log('already visited:', jsonld);
    return opts.referenceNode(jsonld);
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
