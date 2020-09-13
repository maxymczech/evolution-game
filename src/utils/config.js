/* global THREE */

const radius = 0.5;
const a = radius / 2 * Math.sqrt(3);

export default {
  axialNeighbors: [
    { q: 0, r: -1 }, { q: 0, r: 1 },
    { q: -1, r: 0 }, { q: 1, r: 0 },
    { q: -1, r: 1 }, { q: 1, r: -1 }
  ],
  cameraOptions: {
    cameraRotationSpeed: 0.1,
    cameraStartPosition: [0, 4, 6],
    downwardAngle: -Math.PI / 3,
    mapScrollMargin: 100,
    mapScrollRadiusCoefficient: 0.5,
    mapScrollSpeed: 0.2,
    perspective: {
      far: 20,
      fov: 70,
      near: 0.1
    }
  },
  cellMaterialOptions: {
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1
  },
  groundPlaneSizeMultiplier: 2,
  hexVecQ: new THREE.Vector3(2 * a * Math.cos(Math.PI / 6), 0, 2 * a * Math.sin(Math.PI / 6)),
  hexVecR: new THREE.Vector3(0, 0, 2 * a),
  hexLineThickness: 0.1,
  hexRadiusInner: a,
  hexRadiusOuter: radius,
  highlightEmissiveColor: 0xaaaa00,
  objectLayers: {
    groundPlane: 1,
    gridTiles: 2,
    creatures: 3
  }
};
