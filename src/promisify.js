export default function promisify(fun, obj, ...args) {
  return new Promise(function (resolve, reject) {
    let cb = (err, obj) => {
      err ? reject(err) : resolve(obj)
    }
    fun(obj, cb, ...args)
  })
}