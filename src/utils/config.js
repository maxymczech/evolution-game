/* global THREE */

const radius = 0.5;
const a = radius / 2 * Math.sqrt(3);

export default {
  axialNeighbors: [
    { q: 0, r: -1 }, { q: 0, r: 1 },
    { q: -1, r: 0 }, { q: 1, r: 0 },
    { q: -1, r: 1 }, { q: 1, r: -1 }
  ],
  hexVecQ: new THREE.Vector3(2 * a * Math.cos(Math.PI / 6), 0, 2 * a * Math.sin(Math.PI / 6)),
  hexVecR: new THREE.Vector3(0, 0, 2 * a),
  hexLineThickness: 0.1,
  hexRadiusInner: a,
  hexRadiusOuter: radius
};
