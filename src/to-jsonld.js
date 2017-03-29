import Gun from 'gun/gun'

function isRootNode(opts) {
  return !opts.visited || opts.visited.ids.length === 0
}

function defaultLogger(opts) {
  return function log(...args) {
    if (opts.logging) {
      console.log('toLdGraph:', ...args)
    }
  }
}

let log

export function createToLdGraph(opts) {
  let logger = opts.logger || defaultLogger
  log = logger(opts)
  return {
    toLdGraph,
    toJsonLd
  }
}

export async function toLdGraph(node, opts = {}) {
  log = opts.log || log

  let val = await node.$val()
  if (!val._) {
    log('field', val)
    return val
  }

  let id = Gun.node.soul(val)
  log('node id:', id)

  let jsonld = {
    '@id': id
  }

  // if root node
  if (isRootNode(opts)) {
    let context = opts.schemaUrl || 'http://schema.org/'
    log('root node:', context)
    jsonld['@context'] = context
  }

  opts.visited = opts.visited || {
    ids: []
  }

  if (opts.visited.ids.indexOf(id) >= 0) {
    log('already visited:', jsonld)
    return jsonld
  }

  opts.visited.ids.push(id)
  let fullPath = (opts.path || '') + '/' + id
  delete opts['paths']

  async function parse(field) {
    log('recurse', field)
    let fieldNode = node.path(field)
    opts.path = fullPath + '/' + field
    return await toLdGraph(fieldNode, opts)
  }

  let fields = await node.$fields()
  let nodePaths = opts.paths || []
  nodePaths = nodePaths.concat(node._.paths || [])

  if (nodePaths) {
    fields = fields.concat(nodePaths)
  }

  let uniqFields = [...new Set(fields)]

  log('parse fields', uniqFields)
  for (let field of uniqFields) {
    jsonld[field] = await parse(field)
  }

  log('jsonld:', jsonld)
  return jsonld
}

export async function toJsonLd(node, opts = {}) {
  let result = await toLdGraph(node, opts = {})
  return {
    result,
    json: JSON.stringify(result, null, opts.spacer || 2)
  }
}

Gun.chain.$toJsonLd = async function (opts) {
  return await toJsonLd(this, opts)
}