import config from '../config';
import drawGridCell from './draw-grid-cell';
import hexGeometry from '../geometry/hex';

export default function (jsonData, scene, materialOptions) {
  jsonData.forEach(cellData => {
    const { color, elevation, q, r } = cellData;
    const geometry = hexGeometry(config.hexRadiusOuter, config.hexLineThickness, elevation);
    materialOptions.color = color;
    drawGridCell(q, r, scene, geometry, materialOptions, 0xffffff);
  });
}
