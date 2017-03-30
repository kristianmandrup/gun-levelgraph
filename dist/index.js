'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSaveToLvGraph = exports.addToJsonLd = undefined;

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

var _saveLevelgraph = require('./save-levelgraph');

Object.keys(_saveLevelgraph).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _saveLevelgraph[key];
    }
  });
});
exports.addAll = addAll;

var _toJsonld2 = _interopRequireDefault(_toJsonld);

var _saveLevelgraph2 = _interopRequireDefault(_saveLevelgraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addAll(Gun) {
  (0, _toJsonld2.default)(Gun.chain);
  (0, _saveLevelgraph2.default)(Gun.chain);
}

exports.addToJsonLd = _toJsonld2.default;
exports.addSaveToLvGraph = _saveLevelgraph2.default;
exports.default = addAll;
//# sourceMappingURL=index.js.map
