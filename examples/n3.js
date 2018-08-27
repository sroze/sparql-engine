'use strict'

const { Parser, Store } = require('n3')
const { HashMapDataset, Graph, PlanBuilder } = require('sparql-engine')
const { ArrayIterator } = require('asynciterator')

class N3Graph extends Graph {
  constructor () {
    super()
    this._store = Store()
  }

  insert (triple) {
    return new Promise((resolve, reject) => {
      try {
        this._store.addTriple(triple.subject, triple.predicate, triple.object)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  delete (triple) {
    return new Promise((resolve, reject) => {
      try {
        this._store.removeTriple(triple.subject, triple.predicate, triple.object)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  find (triple) {
    let subject = null
    let predicate = null
    let object = null
    if (!triple.subject.startsWith('?')) {
      subject = triple.subject
    }
    if (!triple.predicate.startsWith('?')) {
      predicate = triple.predicate
    }
    if (!triple.object.startsWith('?')) {
      object = triple.object
    }
    return new ArrayIterator(this._store.getTriples(subject, predicate, object))
  }
}

const graph = new N3Graph()
const dataset = new HashMapDataset(graph)

// Load some RDF data into the graph
const parser = new Parser()
parser.parse(`
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix : <http://example.org#> .
  :a foaf:name "a" .
  :b foaf:name "b" .
`).forEach(t => {
  graph._store.addTriple(t)
})

const query = `
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  SELECT ?name
  WHERE {
    ?s foaf:name ?name .
  }`

// Creates a plan builder for the RDF dataset
const builder = new PlanBuilder(dataset)

// Get an iterator to evaluate the query
const iterator = builder.build(query)

// Read results
iterator.on('data', console.log)
iterator.on('error', console.error)
iterator.on('end', () => {
  console.log('Query evaluation complete!')
})
