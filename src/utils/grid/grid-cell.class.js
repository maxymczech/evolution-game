import config from '../config';
import drawGridCell from './draw-grid-cell';
import hexGeometry from '../geometry/hex';

export default class GridCell {
  #elevation
  #q
  #r
  #isFree

  constructor (q, r, elevation, isFree) {
    this.#elevation = elevation;
    this.#isFree = isFree;
    this.#q = q;
    this.#r = r;
  }

  draw (scene) {
    const geometry = hexGeometry(config.hexRadiusOuter, config.hexLineThickness, this.#elevation);
    const materialOptions = Object.assign({
      color: 0xff0000
    }, config.cellMaterialOptions);
    drawGridCell(this.#q, this.#r, scene, geometry, materialOptions);
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
