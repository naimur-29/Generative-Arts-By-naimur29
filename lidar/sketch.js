let l1, l2;

let rays = [];

function calculateT(x1, x2, x3, x4, y1, y2, y3, y4) {
  const dx = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
  const dy = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  return dx / dy;
}

function calculateU(x1, x2, x3, x4, y1, y2, y3, y4) {
  const dx = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
  const dy = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  return dx / dy;
}

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < 360; i += 3) {
    const x = sin(radians(i));
    const y = cos(radians(i));
    rays.push([x, y, random(-1, 1) * width, random(-1, 1) * height]);
  }

  l1 = {
    x: createVector(random(width), random(height)),
    y: createVector(random(width), random(height)),
  };
  l2 = {
    x: createVector(random(width), random(height)),
    y: createVector(random(width), random(height)),
  };

  const t = calculateT(
    l1.x.x,
    l1.y.x,
    l2.x.x,
    l2.y.x,
    l1.x.y,
    l1.y.y,
    l2.x.y,
    l2.y.y
  );
  const u = calculateU(
    l1.x.x,
    l1.y.x,
    l2.x.x,
    l2.y.x,
    l1.x.y,
    l1.y.y,
    l2.x.y,
    l2.y.y
  );

  console.log(t, u);
}

function draw() {
  background(51);

  stroke(255);
  strokeWeight(4);
  line(l1.x.x, l1.x.y, l1.y.x, l1.y.y);
  // line(l2.x.x, l2.x.y, l2.y.x, l2.y.y);

  push();
  translate(mouseX, mouseY);
  for (const ray of rays) {
    strokeWeight(0.5);

    // is intersecting:
    const t = calculateT(
      mouseX,
      ray[2] + mouseY,
      l1.x.x,
      l1.y.x,
      mouseY,
      ray[3] + mouseY,
      l1.x.y,
      l1.y.y
    );
    const u = calculateU(
      mouseX,
      ray[2] + mouseX,
      l1.x.x,
      l1.y.x,
      mouseY,
      ray[3] + mouseY,
      l1.x.y,
      l1.y.y
    );

    // console.log(t, u);
    if ((t >= 0 && t <= 1) || (u >= 0 && u <= 1)) {
      line(ray[0], ray[1], ray[2], ray[3]);
    }
  }
  pop();

  // noLoop();
}
