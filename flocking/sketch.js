let boidsPopulationSize = innerWidth < 580 ? 100 : 500;
const maxPopulationSize = innerWidth < 580 ? 500 : 1000;
let boids = [];

let populationSizeSlider,
  alignmentSlider,
  cohesionSlider,
  separationSlider,
  quadTreeTransparencySlider;

let quadTree,
  quadTreeCapacity = 4,
  povBoid;

function setup() {
  createCanvas(windowWidth - 20, windowHeight * 0.6);
  background(30);

  // SLIDERS:
  populationSizeSlider = createSlider(
    10,
    maxPopulationSize,
    boidsPopulationSize,
    10
  );
  populationSizeSlider.style("width", "270px");

  alignmentSlider = createSlider(0, 2, 1, 0.1);
  alignmentSlider.style("width", "270px");

  cohesionSlider = createSlider(0, 2, 0.5, 0.1);
  cohesionSlider.style("width", "270px");

  separationSlider = createSlider(0, 2, 1, 0.1);
  separationSlider.style("width", "270px");

  quadTreeTransparencySlider = createSlider(0, 255, 0, 5);
  quadTreeTransparencySlider.style("width", "270px");

  // Quad Tree:
  const boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  quadTree = new QuadTree(boundary, quadTreeCapacity);

  // generate boids:
  boids = [];
  for (let i = 0; i < boidsPopulationSize; i++) {
    const boid = new Boid();
    boids.push(boid);
    quadTree.insert(boid);
  }
}

function draw() {
  background(30, 50);

  // reassess population size:
  if (populationSizeSlider.value() !== boidsPopulationSize) {
    boidsPopulationSize = populationSizeSlider.value();
    boids = [];
    for (let i = 0; i < boidsPopulationSize; i++) {
      const boid = new Boid();
      boids.push(boid);
      quadTree.insert(boid);
    }
  }

  // create next quadTree:
  const boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  const nextQuadTree = new QuadTree(boundary, quadTreeCapacity);

  for (let boid of boids) {
    const range = new Rectangle(
      boid.position.x,
      boid.position.y,
      boid.perceptionRadius,
      boid.perceptionRadius
    );
    const neighbors = quadTree.query(range);

    boid.update(neighbors);
    map(quadTreeTransparencySlider.value(), 0, 255, 255, 0) && boid.draw();

    nextQuadTree.insert(boid);
  }
  quadTreeTransparencySlider.value() &&
    nextQuadTree.draw(quadTreeTransparencySlider.value());

  quadTree = nextQuadTree;
}
