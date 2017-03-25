import Gun from 'gun/gun'

export async function toJsonLd(self, opts = {}) {
  let val = await self.$val()
  if (!val._) {
    return val
  }

  let id = Gun.node.soul(val)
  let jsonld = {
    '@id': id
  }
  if (opts.idOnly) {
    return jsonld
  }

  async function parse(field) {
    let fieldNode = await self.path(field)
    return await toJsonLd(fieldNode, {
      idOnly: false
    })
  }

  let fields = await self.$fields()
  if (opts.paths) {
    fields = fields.concat(opts.paths)
  }
  for (let field of fields) {
    jsonld[field] = await parse(field)
  }

  return jsonld
}

Gun.chain.$toJsonLd = async function (opts) {
  return await toJsonLd(this, opts)
}