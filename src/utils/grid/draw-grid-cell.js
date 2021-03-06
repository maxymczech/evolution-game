/* global THREE */

import config from '../config';

export default function (q, r, scene, geometry, materialOptions, lineColor = 0xffffff) {
  const qVec = new THREE.Vector3(config.hexVecQ.x, config.hexVecQ.y, config.hexVecQ.z);
  const rVec = new THREE.Vector3(config.hexVecR.x, config.hexVecR.y, config.hexVecR.z);

  rVec.multiplyScalar(r);
  qVec.multiplyScalar(q);
  rVec.add(qVec);

  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: lineColor,
      linewidth: 2
    })
  );
  const material = new THREE.MeshPhongMaterial(materialOptions);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.layers.set(config.objectLayers.gridTiles);
  mesh.position.set(rVec.x, rVec.y, rVec.z);
  mesh.add(wireframe);
  scene.add(mesh);
  return mesh;
}
