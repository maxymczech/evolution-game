import GridCell from './grid-cell.class';

export default class Grid {
  #cells

  addCell (q, r, elevation, isFree) {
    this.#cells.push(
      new GridCell(q, r, elevation, isFree)
    );
  }

  constructor () {
    this.#cells = [];
  }

  draw (scene) {
    this.#cells.forEach(cell => {
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

  removeCell (q, r) {
    const index = this.#cells.findIndex(cell => cell.q === q && cell.r === r);
    if (index !== -1) {
      this.#cells.splice(index, 1);
    }
  }
}
