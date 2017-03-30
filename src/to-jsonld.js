import Gun from 'gun/gun'

function nodeId(nodeObj) {
  return Gun.node.soul(nodeObj)
}

function isNode(val, opts) {
  return val._
}

function wasVisited(id, opts) {
  let ids = opts.visited.ids
  opts.log('visited ids', ids, '==', id)
  return ids.indexOf(id) >= 0
}

function visit(id, opts) {
  opts.visited.ids.push(id)
}

function addContext(jsonld, node, opts) {
  if (!isFirstVisit(node, opts)) return jsonld

  let context = opts.schemaUrl || 'http://schema.org/'
  opts.log('root node:', context)
  jsonld['@context'] = context
  return jsonld
}

async function getFields(node, opts) {
  let fields = await node.$fields()
  let nodePaths = opts.paths || []
  nodePaths = nodePaths.concat(node._.paths || [])

  if (nodePaths) {
    fields = fields.concat(nodePaths)
  }

  let uniqFields = [...new Set(fields)]

  if (opts.filter) {
    uniqFields = opts.filter(uniqFields, node, opts)
  }
  return uniqFields
}

const isFirstVisit = (node, opts) => {
  return !opts.visited || opts.visited.ids.length === 0
}

const logger = (opts = {}) => {
  return function log(...args) {
    if (opts.logging) {
      console.log('toLdGraph:', ...args)
    }
  }
}

const buildNode = (nodeVal, node, opts) => {
  let jsonld = {}

  // if context node
  jsonld = opts.addContext(jsonld, node, opts)

  let nodeId = opts.nodeId(nodeVal)
  opts.log('node id:', nodeId)

  let id = opts.graphId(nodeId, opts)
  jsonld['@id'] = id

  return {
    jsonld,
    nodeId
  }
}

const graphId = (id) => '#' + id

function addDefaultOpts(opts) {
  opts = Object.assign({
    isFirstVisit,
    wasVisited,
    visit,
    addContext,
    graphId,
    isNode,
    buildNode,
    logger,
    nodeId,
    getFields,
    fullPath,
    prepareOpts
  }, opts)

  opts.log = opts.log || opts.logger(opts)
  return opts
}


let defaultOpts = {}

export function createToLdGraph(opts) {
  defaultOpts = addDefaultOpts(opts)
  return {
    toLdGraph,
    toJsonLd
  }
}

const fullPath = (id, opts) => {
  let path = (opts.path || '') + '/' + id
  delete opts.path
  return path
}

const prepareOpts = (opts) => {
  opts.visited = opts.visited || {
    ids: []
  }
  return opts
}


// TODO: refactor
async function parse(field, node, fullPath, opts) {
  opts.log('recurse', field)
  let fieldNode = node.path(field)
  opts.path = fullPath + '/' + field
  opts.parentNode = node
  return await toLdGraph(fieldNode, opts)
}


export async function toLdGraph(node, opts = {}) {
  opts = Object.assign(addDefaultOpts(defaultOpts), opts)
  let log = opts.log

  let nodeVal = await node.$val()

  if (!opts.isNode(nodeVal)) {
    log('field', nodeVal)
    return nodeVal
  }

  let {
    jsonld,
    nodeId
  } = opts.buildNode(nodeVal, node, opts)

  log('build node', jsonld)
  opts.$id = jsonld['@id']

  opts = opts.prepareOpts(opts)

  if (opts.wasVisited(nodeId, opts)) {
    log('already visited:', jsonld)
    return jsonld
  }

  opts.visit(nodeId, opts)

  let fullPath = opts.fullPath(nodeId, opts)

  let fields = await opts.getFields(node, opts)

  log('parse fields', fields)
  for (let field of fields) {
    jsonld[field] = await parse(field, node, fullPath, opts)
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