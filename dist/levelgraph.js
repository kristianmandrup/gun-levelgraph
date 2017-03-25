'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;
exports.toLvGraph = toLvGraph;

var _gun = require('gun/gun');

var _gun2 = _interopRequireDefault(_gun);

require('gun-edge');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levelup = require('levelup'),
    yourDB = levelup('./yourdb'),
    levelgraph = require('levelgraph'),
    jsonld = require('levelgraph-jsonld'),
    opts = {
  base: 'http://gun.io/base'
};

var db = exports.db = jsonld(levelgraph(yourDB), opts);

function toLvGraph(cb, opt) {
  this.value(function (v) {
    // convert here
    cb(v);
  }, opt);
}

_gun2.default.chain.toTriplets = toLvGraph;
//# sourceMappingURL=levelgraph.js.map
