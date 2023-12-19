let atom = "f";
let variables = ["f", "+", "-", "[", "]"];
let rules = {
  f: "ff+[+f-f-f]-[-f+f+f]",
};

let work = {
  f: (len) => {
    line(0, 0, 0, -len);
    translate(0, -len);
  },
  "+": () => {
    rotate(PI / 6);
  },
  "-": () => {
    rotate(-PI / 6);
  },
  "[": () => {
    push();
  },
  "]": () => {
    pop();
  },
};

let gen = atom;
let len = 150;
let t = 0;

function setup() {
  createCanvas(400, 400);
  background(51);

  for (let i = 0; i < 4; i++) {
    gen = generate(gen, rules);
  }
}

function draw() {
  translate(width / 2, height);
  background(51);
  stroke(255, 100);
  // strokeWeight(2);
  noFill();

  turtle(gen, len);
}

function generate(current, rules) {
  len *= 0.5;
  let next = "";
  for (let v of current) {
    next += rules[v] || v;
  }
  return next;
}

function turtle(gen, len) {
  for (let i = 0; i < t; i++) {
    work[gen[i]](len);
  }

  t += 500;
  if (t >= gen.length) {
    t = 0;
    noLoop();
  }
}
