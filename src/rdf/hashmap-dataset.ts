/* file : hashmap-dataset.ts
MIT License

Copyright (c) 2018-2020 Thomas Minier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

import { NamedNode } from 'rdf-js'
import Graph from './graph'
import Dataset from './dataset'

/**
 * A simple Dataset backed by a HashMap.
 * @extends Dataset
 * @author Thomas Minier
 */
export default class HashMapDataset extends Dataset {
  private _defaultGraph: Graph
  private readonly _namedGraphs: Map<NamedNode, Graph>
  /**
   * Constructor
   * @param defaultGraphIRI - IRI of the Default Graph
   * @param defaultGraph     - Default Graph
   */
  constructor (defaultGraphIRI: NamedNode, defaultGraph: Graph) {
    super()
    defaultGraph.iri = defaultGraphIRI
    this._defaultGraph = defaultGraph
    this._namedGraphs = new Map()
  }

  get iris (): NamedNode[] {
    return Array.from(this._namedGraphs.keys())
  }

  setDefaultGraph (g: Graph): void {
    this._defaultGraph = g
  }

  getDefaultGraph (): Graph {
    return this._defaultGraph
  }

  addNamedGraph (iri: NamedNode, g: Graph): void {
    g.iri = iri
    this._namedGraphs.set(iri, g)
  }

  getNamedGraph (iri: NamedNode): Graph {
    if (iri.equals(this._defaultGraph.iri)) {
      return this.getDefaultGraph()
    } else if (!this._namedGraphs.has(iri)) {
      throw new Error(`Unknown graph with iri ${iri}`)
    }
    return this._namedGraphs.get(iri)!
  }

  hasNamedGraph (iri: NamedNode): boolean {
    return this._namedGraphs.has(iri)
  }

  deleteNamedGraph (iri: NamedNode): void {
    if (this._namedGraphs.has(iri)) {
      this._namedGraphs.delete(iri)
    } else {
      throw new Error(`Cannot delete unknown graph with iri ${iri}`)
    }
  }
}
