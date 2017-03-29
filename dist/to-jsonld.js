'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createToLdGraph = createToLdGraph;
exports.toLdGraph = toLdGraph;
exports.toJsonLd = toJsonLd;

var _gun = require('gun/gun');

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function isRootNode(opts) {
  return !opts.visited || opts.visited.ids.length === 0;
}

function defaultLogger(opts) {
  return function log() {
    if (opts.logging) {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['toLdGraph:'].concat(args));
    }
  };
}

var defaultGraphId = function defaultGraphId(id) {
  return '#' + id;
};

var log = void 0;

function createToLdGraph(opts) {
  var logger = opts.logger || defaultLogger;
  log = logger(opts);
  defaultGraphId = opts.graphId || defaultGraphId;
  return {
    toLdGraph: toLdGraph,
    toJsonLd: toJsonLd
  };
}

async function toLdGraph(node) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  log = opts.log || log;

  var val = await node.$val();
  if (!val._) {
    log('field', val);
    return val;
  }

  var jsonld = {};

  // if root node
  if (isRootNode(opts)) {
    var context = opts.schemaUrl || 'http://schema.org/';
    log('root node:', context);
    jsonld['@context'] = context;
  }

  var soul = _gun2.default.node.soul(val);
  log('node id:', soul);

  var ldGraphId = opts.graphId || defaultGraphId;
  var id = ldGraphId(soul, opts);
  jsonld['@id'] = id;

  opts.visited = opts.visited || {
    ids: []
  };

  if (opts.visited.ids.indexOf(id) >= 0) {
    log('already visited:', jsonld);
    return jsonld;
  }

  opts.visited.ids.push(id);
  var fullPath = (opts.path || '') + '/' + id;
  delete opts['paths'];

  // TODO: refactor
  async function parse(field, node) {
    log('recurse', field);
    var fieldNode = node.path(field);
    opts.path = fullPath + '/' + field;
    opts.parentNode = node;
    return await toLdGraph(fieldNode, opts);
  }

  var fields = await node.$fields();
  var nodePaths = opts.paths || [];
  nodePaths = nodePaths.concat(node._.paths || []);

  if (nodePaths) {
    fields = fields.concat(nodePaths);
  }

  var uniqFields = [].concat(_toConsumableArray(new Set(fields)));

  if (opts.filter) {
    uniqFields = filter(uniqFields);
  }

  log('parse fields', uniqFields);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = uniqFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      jsonld[field] = await parse(field, node);
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

_gun2.default.chain.$toJsonLd = async function (opts) {
  return await toJsonLd(this, opts);
};
//# sourceMappingURL=to-jsonld.js.map
