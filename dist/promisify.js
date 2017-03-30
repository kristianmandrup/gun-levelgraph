"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
exports.promisify2 = promisify2;
exports.promisify3 = promisify3;
function promisify(fun, arg1) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      // console.log('cb', err, obj)
      err ? reject(err) : resolve(obj);
    };
    fun.apply(undefined, [arg1, cb].concat(args));
  });
}

function promisify2(fun, arg1, arg2) {
  for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      // console.log('promisifyWithOpts cb:', err, obj)
      err ? reject(err) : resolve(obj);
    };
    // console.log('promisifyWithOpts:', obj, opts, fun)
    fun.apply(undefined, [arg1, arg2, cb].concat(args));
  });
}

function promisify3(fun, arg1, arg2, arg3) {
  for (var _len3 = arguments.length, args = Array(_len3 > 4 ? _len3 - 4 : 0), _key3 = 4; _key3 < _len3; _key3++) {
    args[_key3 - 4] = arguments[_key3];
  }

  return new Promise(function (resolve, reject) {
    var cb = function cb(err, obj) {
      // console.log('promisifyWithOpts cb:', err, obj)
      err ? reject(err) : resolve(obj);
    };
    // console.log('promisifyWithOpts:', obj, opts, fun)
    fun.apply(undefined, [arg1, arg2, arg3, cb].concat(args));
  });
}
//# sourceMappingURL=promisify.js.map
