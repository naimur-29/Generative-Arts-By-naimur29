let scale = 10,
  img,
  img2,
  imgData = [],
  img2Data = [],
  newImgData = [];

let changeRatio = 1;

function preload() {
  img = loadImage("./img3.jpg");
  img2 = loadImage("./img.jpg");
}

function setup() {
  createCanvas(500, 500);
  background(0);
  strokeWeight(4);

  //////////////////// IMAGE START
  // access the pixel information from image:
  imgData = getPixels(img, scale, width, height);
  img2Data = getPixels(img2, scale, width, height);

  const temp = [...imgData];
  for (let i = 0; i < img2Data.length; i++) {
    const val = random(255);
    imgData[i] = [val];
  }
  //////////////////// IMAGE END
}

function draw() {
  for (let y = 0; y < width / scale; y++) {
    for (let x = 0; x < height / scale; x++) {
      let i = y + x * ceil(height / scale);
      const data = imgData[i];
      const data2 = img2Data[i];

      for (let i = 0; i < 3; i++) {
        if (max(data[i], data2[i]) > data2[i]) {
          data[i] -= changeRatio;
        }
      }

      const c = random([data, data2]);

      noFill();
      stroke(c);
      strokeWeight(0.1);
      ellipse(x * scale, y * scale, scale, scale);
      rect(x * scale, y * scale, scale / 2, scale / 2);
    }
  }

  if (frameCount >= 1000) {
    console.log("done!");
    noLoop();
  }
}

/////////// FUNCTIONS ////////////
// draw from imgData:
function drawImg(imgData, scale, width, height) {
  for (let y = 0; y < width / scale; y++) {
    for (let x = 0; x < height / scale; x++) {
      let i = y + x * (height / scale);
      let c = imgData[i];

      noStroke();
      fill(c);
      rect(x * scale, y * scale, scale, scale);
    }
  }
}

// get the pixel data from image:
function getPixels(img, scale, width, height) {
  let data = [];
  for (let x = 0; x < width; x += scale) {
    for (let y = 0; y < height; y += scale) {
      let c = img.get(x / (width / img.width), y / (height / img.height));

      c = [c[0], c[1], c[2]];

      data.push(c);
    }
  }
  return [...data];
}

function getGrayPixels(img, scale, width, height, inverted = false) {
  let data = [];
  for (let x = 0; x < width; x += scale) {
    for (let y = 0; y < height; y += scale) {
      let c = img.get(x / (width / img.width), y / (height / img.height));

      c = (c[0] + c[1] + c[2]) / 3;
      if (inverted) c = 255 - c;

      data.push(c);
    }
  }
  return [...data];
}
