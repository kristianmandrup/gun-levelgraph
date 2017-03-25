'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toLdGraph = toLdGraph;
exports.toJsonLd = toJsonLd;

var _gun = require('gun/gun');

var _gun2 = _interopRequireDefault(_gun);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function toLdGraph(self) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var val = await self.$val();
  if (!val._) {
    return val;
  }

  var id = _gun2.default.node.soul(val);

  opts.visited = opts.visited || {
    ids: []
  };

  var jsonld = {
    '@id': id
  };
  if (opts.visited.ids.indexOf(id) >= 0) {
    return jsonld;
  }

  opts.visited.ids.push(id);
  var fullPath = (opts.path || '') + '/' + id;
  delete opts['paths'];

  async function parse(field) {
    var fieldNode = await self.path(field);
    opts.path = fullPath + '/' + field;
    return await toLdGraph(fieldNode, opts);
  }

  var fields = await self.$fields();
  if (opts.paths) {
    fields = fields.concat(opts.paths);
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      jsonld[field] = await parse(field);
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

async function toJsonLd(self) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var result = await toLdGraph(self, opts = {});
  return {
    result: result,
    json: JSON.stringify(result, null, opts.spacer || 2)
  };
}

_gun2.default.chain.$toJsonLd = async function (opts) {
  return await toJsonLd(this, opts);
};
//# sourceMappingURL=to-jsonld.js.map
