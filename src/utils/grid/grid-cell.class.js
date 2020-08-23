import config from '../config';
import drawGridCell from './draw-grid-cell';
import hexGeometry from '../geometry/hex';

export default class GridCell {
  #color
  #elevation
  #q
  #r
  #isFree

  get color () {
    return this.#color;
  }

  constructor (q, r, elevation, color, isFree) {
    this.#color = color;
    this.#elevation = elevation;
    this.#isFree = isFree;
    this.#q = q;
    this.#r = r;
  }

  draw (scene) {
    const geometry = hexGeometry(config.hexRadiusOuter, config.hexLineThickness, this.#elevation);
    const materialOptions = Object.assign({
      color: this.#color
    }, config.cellMaterialOptions);

    const sceneMesh = drawGridCell(this.#q, this.#r, scene, geometry, materialOptions);

    // TODO: rethink storing coordinates in scene object...
    sceneMesh._q = this.#q;
    sceneMesh._r = this.#r;
  }

  get elevation () {
    return this.#elevation;
  }

  get isFree () {
    return this.#isFree;
  }

  get q () {
    return this.#q;
  }

  get r () {
    return this.#r;
  }
}
