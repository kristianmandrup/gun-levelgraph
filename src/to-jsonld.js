import Gun from 'gun/gun'

function defaultIsRootNode(node, opts) {
  return !opts.visited || opts.visited.ids.length === 0
}

function defaultLogger(opts) {
  return function log(...args) {
    if (opts.logging) {
      console.log('toLdGraph:', ...args)
    }
  }
}

let defaultGraphId = (id) => '#' + id

let log

export function createToLdGraph(opts) {
  let logger = opts.logger || defaultLogger
  log = logger(opts)
  defaultGraphId = opts.graphId || defaultGraphId
  return {
    toLdGraph,
    toJsonLd
  }
}

function defaultIsNode(val, opts) {
  return val._
}

export async function toLdGraph(node, opts = {}) {
  log = opts.log || log

  let isNode = opts.isNode || defaultIsNode

  let val = await node.$val()
  if (!isNode(val)) {
    log('field', val)
    return val
  }

  let jsonld = {}
  let isRootNode = opts.isRootNode || defaultIsRootNode

  // if root node
  if (isRootNode(node, opts)) {
    let context = opts.schemaUrl || 'http://schema.org/'
    log('root node:', context)
    jsonld['@context'] = context
  }

  let soul = Gun.node.soul(val)
  log('node id:', soul)

  let ldGraphId = opts.graphId || defaultGraphId
  let id = ldGraphId(soul, opts)
  jsonld['@id'] = id

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

  // TODO: refactor
  async function parse(field, node) {
    log('recurse', field)
    let fieldNode = node.path(field)
    opts.path = fullPath + '/' + field
    opts.parentNode = node
    return await toLdGraph(fieldNode, opts)
  }

  let fields = await node.$fields()
  let nodePaths = opts.paths || []
  nodePaths = nodePaths.concat(node._.paths || [])

  if (nodePaths) {
    fields = fields.concat(nodePaths)
  }

  let uniqFields = [...new Set(fields)]

  if (opts.filter) {
    uniqFields = filter(uniqFields, node, opts)
  }

  log('parse fields', uniqFields)
  for (let field of uniqFields) {
    jsonld[field] = await parse(field, node)
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