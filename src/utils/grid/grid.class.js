import GridCell from './grid-cell.class';
import TinyQueue from 'tinyqueue';
import config from '../config';

export default class Grid {
  #cells
  #radius

  addCell (q, r, elevation, color, isFree) {
    const key = this.cellKey(q, r);
    this.#cells[key] = new GridCell(q, r, elevation, color, isFree);
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

  distance (from, to) {
    return (Math.abs(from.q - to.q) + Math.abs(from.q + from.r - to.q - to.r) + Math.abs(from.r - to.r)) / 2;
  }

  draw (scene) {
    Object.entries(this.#cells).forEach(([key, cell]) => {
      cell.draw(scene);
    });
  }

  findPath (from, to) {
    const keyFrom = this.cellKey(from.q, from.r);
    const keyGoal = this.cellKey(to.q, to.r);

    const openSet = new TinyQueue([from], (a, b) => {
      return fScore[this.cellKey(a.q, a.r)] - fScore[this.cellKey(b.q, b.r)];
    });
    const openSetHash = {};
    openSetHash[keyFrom] = true;

    const cameFrom = {};

    const gScore = {};
    gScore[keyFrom] = 0;

    const fScore = {};
    fScore[keyFrom] = this.distance(from, to);

    while (openSet.length) {
      const current = openSet.pop();
      const keyCurrent = this.cellKey(current.q, current.r);
      openSetHash[keyCurrent] = false;

      if (keyCurrent === keyGoal) {
        const path = [];
        let node = current;
        let keyNode = this.cellKey(node.q, node.r);
        while (keyFrom !== keyNode) {
          path.push(node);
          node = cameFrom[keyNode];
          keyNode = this.cellKey(node.q, node.r);
        }
        path.push(from);
        path.reverse();
        return path;
      }

      const neighbors = this.cellNeighbors(current.q, current.r, true);
      neighbors.forEach(neighbor => {
        const keyNeighbor = this.cellKey(neighbor.q, neighbor.r);

        // TODO: add custom distance calculation based on elevation difference and terrain type
        const gScoreTentative = gScore[keyCurrent] + 1;

        const gScoreNeighbor = gScore[keyNeighbor] || Infinity;

        if (gScoreTentative < gScoreNeighbor) {
          cameFrom[keyNeighbor] = current;
          gScore[keyNeighbor] = gScoreTentative;
          fScore[keyNeighbor] = gScore[keyNeighbor] + this.distance(neighbor, to);
          if (!openSetHash[keyNeighbor]) {
            openSetHash[keyNeighbor] = true;
            openSet.push(neighbor);
          }
        }
      });
    }
    return false;
  }

  fromJSONData (gridData) {
    this.#radius = gridData.radius;
    if (Array.isArray(gridData.hexData)) {
      gridData.hexData.forEach(cellData => {
        const { color, elevation, isFree, q, r } = cellData;
        this.addCell(q, r, elevation, color, isFree);
      });
    }
  }

  getCell (q, r) {
    const key = this.cellKey(q, r);
    return this.#cells[key] || null;
  }

  highlightCell (q, r, highlight = true) {
    const cell = this.getCell(q, r);
    if (cell) {
      cell.mesh.material.emissive.setHex(config.highlightEmissiveColor);
    }
  }

  get radius () {
    return this.#radius;
  }

  removeCell (q, r) {
    const key = this.cellKey(q, r);
    delete this.#cells[key];
  }
}
