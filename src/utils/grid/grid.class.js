import GridCell from './grid-cell.class';
import config from '../config';

export default class Grid {
  #cells

  addCell (q, r, elevation, isFree) {
    const key = this.cellKey(q, r);
    this.#cells[key] = new GridCell(q, r, elevation, isFree);
  }

  cellKey (q, r) {
    return `${q}_${r}`;
  }

  cellNeighbors (q, r, onlyFree = false) {
    const result = [];
    config.axialNeighbors.forEach(({ q: qNext, r: rNext }) => {
      const cell = this.getCell(q + qNext, r + rNext);
      if (cell && (cell.isFree || !onlyFree)) {
        result.push(cell);
      }
    });
    return result;
  }

  constructor () {
    this.#cells = {};
  }

  draw (scene) {
    Object.entries(this.#cells).forEach(([key, cell]) => {
      cell.draw(scene);
    });
  }

  findPath ({ q: qFrom, r: rFrom }, { q: qTo, r: rTo }) {
  }

  fromJSONData (gridData) {
    if (Array.isArray(gridData)) {
      gridData.forEach(cellData => {
        const { color, elevation, isFree, q, r } = cellData;
        this.addCell(q, r, elevation, color, isFree);
      });
    }
  }

  getCell (q, r) {
    const key = this.cellKey(q, r);
    return this.#cells[key] || null;
  }

  removeCell (q, r) {
    const key = this.cellKey(q, r);
    delete this.#cells[key];
  }
}
