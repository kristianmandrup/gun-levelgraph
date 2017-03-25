import Gun from 'gun/gun'

export async function toTriplets(self, opts = {}) {
  let val = await self.$val()
  if (!val._) {
    return val
  }

  // convert here
  let id = Gun.node.soul(val)
  let triplets = {
    '@id': id
  }
  if (opts.idOnly) {
    return triplets
  }

  async function parse(field) {
    let fieldNode = await self.path(field)
    return await toTriplets(fieldNode, {
      idOnly: false
    })
  }

  let fields = await self.$fields()
  if (opts.paths) {
    console.log('add paths', opts.paths)
    fields = fields.concat(opts.paths)
  }
  console.log('fields', fields)

  for (let field of fields) {
    console.log('field', field)
    triplets[field] = await parse(field)
  }

  // self.$mapReduce({
  //   newValue: (val) => toTriplets(val)
  // })

  return triplets
}

Gun.chain.$toTriplets = async function (opts) {
  return await toTriplets(this, opts)
}