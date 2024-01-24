class Circle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = 2;
    this.color = color;
    this.growing = true;
    this.rect = random() > 0.5;
  }

  grow() {
    if (this.growing) {
      this.r += 0.5;
    }
  }

  show() {
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    if (this.rect) rect(this.x, this.y, this.r * 2, this.r * 2);
    else ellipse(this.x, this.y, this.r * 2, this.r * 2);
    // ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  edges() {
    return (
      this.x + this.r >= width ||
      this.x - this.r <= 0 ||
      this.y + this.r >= height ||
      this.y - this.r <= 0
    );
  }
}
