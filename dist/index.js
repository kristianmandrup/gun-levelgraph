'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toJsonld = require('./to-jsonld');

Object.keys(_toJsonld).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _toJsonld[key];
    }
  });
});

var _levelgraph = require('./levelgraph');

Object.defineProperty(exports, 'createForLvGraph', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_levelgraph).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = createForLvGraph;
//# sourceMappingURL=index.js.map
