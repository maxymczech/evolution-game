import drawGridCell from './draw-grid-cell';

export default function (radius, scene, geometry, materialOptions, color, zeroCellColor) {
  for (let rad = 1; rad <= radius; rad++) {
    for (let i = 0; i < rad; i++) {
      drawGridCell(rad, -i, scene, geometry, materialOptions, color);
      drawGridCell(i + 1, -rad, scene, geometry, materialOptions, color);
      drawGridCell(-i, i - rad, scene, geometry, materialOptions, color);
      drawGridCell(-rad, i, scene, geometry, materialOptions, color);
      drawGridCell(-i - 1, rad, scene, geometry, materialOptions, color);
      drawGridCell(i, rad - i, scene, geometry, materialOptions, color);
    }
  }

  drawGridCell(0, 0, scene, geometry, materialOptions, zeroCellColor || color);
}
