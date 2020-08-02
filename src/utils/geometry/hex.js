/* global THREE */

export default function hexGeometry (radius, depth) {
  const shape = new THREE.Shape();
  shape.moveTo(radius, 0);
  for (let i = 1; i <= 6; i++) {
    const angle = i * (Math.PI / 3);
    shape.lineTo(
      radius * Math.cos(angle),
      radius * Math.sin(angle)
    );
  }

  var extrudeSettings = {
    steps: 2,
    depth,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return geometry;
}
