import Gun from 'gun/gun'
import chain from 'gun-edge'

chain(Gun)

export async function toTriplets(self, opt) {
  console.log(self)
  let v = await self.$value()
  // convert here
  let id = Gun.node.soul(v)
  let node = {
    '@id': id
  }
  let fields = await v.$fields()
  node = fields.reduce((obj, f) => {
    obj[f] = f
    return obj
  }, node)
  return node
}

Gun.chain.toTriplets = async function (opt) {
  return await toTriplets(this, opt)
}