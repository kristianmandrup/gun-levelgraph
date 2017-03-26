import Gun from 'gun/gun'

export async function toLdGraph(self, opts = {}) {
  let val = await self.$val()
  if (!val._) {
    return val
  }

  let id = Gun.node.soul(val)

  opts.visited = opts.visited || {
    ids: []
  }

  let jsonld = {
    '@id': id
  }
  if (opts.visited.ids.indexOf(id) >= 0) {
    return jsonld
  }

  opts.visited.ids.push(id)
  let fullPath = (opts.path || '') + '/' + id
  delete opts['paths']

  async function parse(field) {
    let fieldNode = self.path(field)
    opts.path = fullPath + '/' + field
    return await toLdGraph(fieldNode, opts)
  }

  let fields = await self.$fields()
  let nodePaths = opts.paths || []
  nodePaths = nodePaths.concat(self._.paths || [])

  if (nodePaths) {
    fields = fields.concat(nodePaths)
  }
  for (let field of fields) {
    jsonld[field] = await parse(field)
  }

  return jsonld
}

export async function toJsonLd(self, opts = {}) {
  let result = await toLdGraph(self, opts = {})
  return {
    result,
    json: JSON.stringify(result, null, opts.spacer || 2)
  }
}

Gun.chain.$toJsonLd = async function (opts) {
  return await toJsonLd(this, opts)
}