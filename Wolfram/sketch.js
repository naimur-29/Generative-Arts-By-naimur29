let grid = [], ruleSet = [];;
let size = 201;
let rule = 182;
let w, y = 0;

function setup() {
  createCanvas(800, 1920);
  background(51);
  // frameRate(10);

  w = width/size;
  for (let i = 0; i < size; i++) {
    grid.push(0);
  }
  grid[(size - 1) / 2] = 1;

  let ruleStr = rule.toString(2);
  ruleStr = "0".repeat(8 - ruleStr.length) + ruleStr;
  ruleSet = ruleStr.split('').map(e => Number(e))
  console.log(rule, ruleSet);
}

function draw() {
  const nextGrid = [];
  for (let i = 0; i < size; i++) {
    const leftNeighbor = grid[(size + i - 1) % size];
    const cell = grid[i];
    const rightNeighbor = grid[(size + i + 1) % size];
    const nextState = getNextCellState(leftNeighbor, cell, rightNeighbor);
    nextGrid.push(nextState);

    noStroke();
    fill(51);
    if (cell === 1) {
      fill(51, 255, 151);
    }
    square(i * w, y, w);
  }
  y += w;
  grid = nextGrid;

  if (y >= height) noLoop();
}

function getNextCellState(left, cell, right) {
  const totalState = "" + left + cell + right;
  const nextState = ruleSet[7 - parseInt(totalState, 2)];
  return nextState;
}
