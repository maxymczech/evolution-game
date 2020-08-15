export default function (gridData) {
  gridData.forEach(cellData => {
    cellData.color = parseInt(cellData.color);
  });
}
