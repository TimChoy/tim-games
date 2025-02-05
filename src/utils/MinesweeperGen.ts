var _ = require("lodash");

export function MinesweeperGen(width: number, height: number, mines: number) {
  // Initialize matrix
  const matrix: number[][] = [];

  for (let i = 0; i < height; i++) {
    matrix.push(Array.from(Array(width), () => 0));
  }

  // Generate, place mines and adjacent numbered squares
  const mineList: number[] = _.sampleSize(_.range(0, width * height), mines);
  mineList.forEach((loc) => {
    const row = Math.floor(loc / width);
    const col = loc % width;
    matrix[row][col] = 9; // 9 represents a mine
    const neighbours = [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ];
    neighbours.forEach((n) => {
      if (
        0 <= n[0] &&
        n[0] < height &&
        0 <= n[1] &&
        n[1] < width &&
        matrix[n[0]][n[1]] != 9
      ) {
        matrix[n[0]][n[1]]++;
      }
    });
  });

  // TODO Board validation

  return [...matrix];
}
