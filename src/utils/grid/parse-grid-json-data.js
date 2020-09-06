export default function (gridData) {
  gridData.hexData.forEach(cellData => {
    cellData.color = parseInt(cellData.color);
  });
}
