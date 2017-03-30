"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = promisify;
function promisify(fun, obj) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      err ? reject(err) : resolve(obj);
    };
    fun.apply(undefined, [obj, cb].concat(args));
  });
}
//# sourceMappingURL=promisify.js.map
