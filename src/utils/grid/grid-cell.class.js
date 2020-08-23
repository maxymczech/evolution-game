import config from '../config';
import drawGridCell from './draw-grid-cell';
import hexGeometry from '../geometry/hex';

export default class GridCell {
  #color
  #elevation
  #mesh
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
    this.#mesh = null;
    this.#q = q;
    this.#r = r;
  }

  draw (scene) {
    const geometry = hexGeometry(config.hexRadiusOuter, config.hexLineThickness, this.#elevation);
    const materialOptions = Object.assign({
      color: this.#color
    }, config.cellMaterialOptions);

    this.#mesh = drawGridCell(this.#q, this.#r, scene, geometry, materialOptions);

    // TODO: rethink storing coordinates in scene object...
    this.#mesh._q = this.#q;
    this.#mesh._r = this.#r;
  }

  get elevation () {
    return this.#elevation;
  }

  get isFree () {
    return this.#isFree;
  }

  get mesh () {
    return this.#mesh;
  }

  get q () {
    return this.#q;
  }

  get r () {
    return this.#r;
  }
}
