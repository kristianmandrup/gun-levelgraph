import addToJsonLd from './to-jsonld'
import addSaveToLvGraph from './save-levelgraph'

export * from './to-jsonld'
export * from './save-levelgraph'

export function addAll(Gun) {
  addToJsonLd(Gun.chain)
  addSaveToLvGraph(Gun.chain)
}

export {
  addToJsonLd,
  addSaveToLvGraph
}

export default addAll