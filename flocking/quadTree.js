class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = [51, 255, 149];
  }

  draw(alpha = 255, color = null) {
    noFill();
    if (color) {
      stroke(...color, alpha);
    } else stroke(...this.color, alpha);
    // strokeWeight(0.2);
    rectMode(CENTER);
    rect(this.x, this.y, this.w * 2, this.h * 2);
  }

  contains(element) {
    return (
      element.position.x >= this.x - this.w &&
      element.position.x <= this.x + this.w &&
      element.position.y >= this.y - this.h &&
      element.position.y <= this.y + this.h
    );
  }

  intersects(rect) {
    return !(
      rect.x - rect.w >= this.x + this.w ||
      rect.x + rect.w <= this.x - this.w ||
      rect.y - rect.h >= this.y + this.h ||
      rect.y + rect.h <= this.y - this.h
    );
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.isDivided = false;
    this.elements = [];
  }

  draw(alpha) {
    this.boundary.draw(alpha);

    if (this.isDivided) {
      this.topRight.draw(alpha);
      this.topLeft.draw(alpha);
      this.bottomRight.draw(alpha);
      this.bottomLeft.draw(alpha);
    }
  }

  insert(element) {
    if (!this.boundary.contains(element)) {
      return false;
    }

    if (this.elements.length < this.capacity) {
      this.elements.push(element);
      return true;
    } else {
      if (!this.isDivided) {
        this.subDivide();
      }

      //   if (this.topRight.insert(element)) return true;
      //   else if (this.topLeft.insert(element)) return true;
      //   else if (this.bottomRight.insert(element)) return true;
      //   else if (this.bottomLeft.insert(element)) return true;

      this.topRight.insert(element) ||
        this.topLeft.insert(element) ||
        this.bottomRight.insert(element) ||
        this.bottomLeft.insert(element);
    }
  }

  subDivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w / 2;
    const h = this.boundary.h / 2;

    this.topRight = new QuadTree(
      new Rectangle(x + w, y - h, w, h),
      this.capacity
    );
    this.topLeft = new QuadTree(
      new Rectangle(x - w, y - h, w, h),
      this.capacity
    );
    this.bottomRight = new QuadTree(
      new Rectangle(x + w, y + h, w, h),
      this.capacity
    );
    this.bottomLeft = new QuadTree(
      new Rectangle(x - w, y + h, w, h),
      this.capacity
    );

    this.isDivided = true;
  }

  query(range, res = []) {
    if (!this.boundary.intersects(range)) {
      return res;
    }

    for (let element of this.elements) {
      if (range.contains(element)) {
        res.push(element);
      }
    }

    if (this.isDivided) {
      this.topRight.query(range, res);
      this.topLeft.query(range, res);
      this.bottomRight.query(range, res);
      this.bottomLeft.query(range, res);
    }

    return res;
  }
}
