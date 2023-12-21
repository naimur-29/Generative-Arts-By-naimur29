let scale = 4,
  img,
  imgData = [],
  newImgData = [];

let randomPixel;

function preload() {
  img = loadImage("./test.jpg");
}

var r = scale * 2;
var k = 30;
var grid = [];
var w = r / Math.sqrt(2);
var active = [];
var cols, rows;
var ordered = [];

function setup() {
  createCanvas(500, 500);
  background(0);
  strokeWeight(4);

  //////////////////// IMAGE START
  // access the pixel information from image:
  imgData = getPixels(img, scale, width, height);
  // console.log(imgData.length);

  let temp = [...imgData];
  temp.sort((a, b) => a[0] + a[1] + a[2] + (b[0] + b[1] + b[2]));
  randomPixel = temp[temp.length - 1];
  //////////////////// IMAGE END

  // STEP 0
  cols = floor(width / w);
  rows = floor(height / w);
  for (var i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }

  // STEP 1
  var x = width;
  var y = height;
  var i = floor(x / w);
  var j = floor(y / w);
  var pos = createVector(x, y);
  grid[i + j * cols] = pos;
  active.push(pos);
}

// function mousePressed() {
//   //////////////////// IMAGE START
//   // access the pixel information from image:
//   imgData = getPixels(img, scale, width, height);
//   console.log(imgData.length);

//   let temp = [...imgData];
//   temp.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
//   randomPixel = temp[temp.length - 1];
//   //////////////////// IMAGE END

//   // STEP 0
//   cols = floor(width / w);
//   rows = floor(height / w);
//   for (var i = 0; i < cols * rows; i++) {
//     grid[i] = undefined;
//   }

//   // STEP 1
//   var x = width;
//   var y = height;
//   var i = floor(x / w);
//   var j = floor(y / w);
//   var pos = createVector(x, y);
//   grid[i + j * cols] = pos;
//   active.push(pos);
// }

function draw() {
  background(randomPixel || 0);

  for (var total = 0; total < 500; total++) {
    if (active.length > 0) {
      var randIndex = floor(random(active.length));
      var pos = active[randIndex];
      var found = false;
      for (var n = 0; n < k; n++) {
        var sample = p5.Vector.random2D();
        var m = random(r, 2 * r);
        sample.setMag(m);
        sample.add(pos);

        var col = floor(sample.x / w);
        var row = floor(sample.y / w);

        if (
          col > -1 &&
          row > -1 &&
          col < cols &&
          row < rows &&
          !grid[col + row * cols]
        ) {
          var ok = true;
          for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
              var index = col + i + (row + j) * cols;
              var neighbor = grid[index];
              if (neighbor) {
                var d = p5.Vector.dist(sample, neighbor);
                if (d < r) {
                  ok = false;
                }
              }
            }
          }
          if (ok) {
            found = true;
            grid[col + row * cols] = sample;
            active.push(sample);
            ordered.push(sample);
            // Should we break?
            break;
          }
        }
      }

      if (!found) {
        active.splice(randIndex, 1);
      }
    }
  }

  // for (var i = 0; i < ordered.length; i++) {
  //   if (ordered[i]) {
  //     // let ind = floor(ordered[i].y + ordered[i].x * scale * r);
  //     let ind = ordered[i].y + ordered[i].x * (height / r);
  //     ind = floor(
  //       map(ind, 0, width + height * (height / r), 0, imgData.length)
  //     );
  //     // console.log(ind);
  //     // noLoop();
  //     let c = imgData[ind];
  //     // let c = random(imgData);

  //     stroke(c);
  //     fill(c);
  //     strokeWeight(2);
  //     rectMode(CENTER);
  //     rect(ordered[i].x, ordered[i].y, r, r);
  //   }
  // }

  // for (var i = 0; i < active.length; i++) {
  //   let c = [255];
  //   stroke(c);
  //   fill(0, 255, 0, 50);
  //   strokeWeight(r / 4);
  //   rectMode(CENTER);
  //   rect(active[i].x, active[i].y, r, r);
  // }

  for (let y = 0; y < width / scale; y++) {
    for (let x = 0; x < height / scale; x++) {
      let i = y + x * (height / scale);
      let c = imgData[i];
      i = floor(map(i, 0, imgData.length, 0, grid.length));

      if (grid[i]) {
        noFill();
        stroke(c);
        strokeWeight(r);
        rect(x * scale, y * scale, scale, scale);
      }
    }
  }

  // drawImg(imgData, scale, width, height);
  // noLoop();
}

/////////////////////////////////////////////////////////////////////////////////

// function draw() {
//     drawImg(imgData, scale, width, height);
//   noLoop();
// }

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

      c = [c[0] * 1.2, c[1] * 1.2, c[2] * 1.2];

      data.push(c);
    }
  }
  return [...data];
}
