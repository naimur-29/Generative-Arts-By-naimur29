class Boid {
  constructor(isThisOne = false) {
    this.isThisOne = isThisOne;
    this.perceptionRadius = 30;
    this.radius = 4;
    this.maxSpeed = 4;
    this.maxForce = 0.4;
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.acceleration = p5.Vector.random2D();
  }

  update(snapshot) {
    // calculate flocking force:
    const flockingForce = this.calculateFlockingForce(snapshot);
    flockingForce.alignmentForce.limit(this.maxForce);
    flockingForce.cohesionForce.limit(this.maxForce);
    flockingForce.separationForce.limit(this.maxForce);

    // scale by slider value:
    flockingForce.alignmentForce.mult(alignmentSlider.value());
    flockingForce.cohesionForce.mult(cohesionSlider.value());
    flockingForce.separationForce.mult(separationSlider.value());

    this.acceleration.add(flockingForce.alignmentForce);
    this.acceleration.add(flockingForce.cohesionForce);
    this.acceleration.add(flockingForce.separationForce);

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
    this.connectEdges();
  }

  draw() {
    if (this.isThisOne) this.drawPerceptionRadius();

    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    const color = [
      map(this.velocity.x, -this.maxSpeed, this.maxSpeed, 0, 255),
      map(this.velocity.y, -this.maxSpeed, this.maxSpeed, 0, 255),
      255,
      map(quadTreeTransparencySlider.value(), 0, 255, 255, 0),
    ];

    fill(color);
    if (this.isThisOne) fill(255, 0, 0, 200);
    noStroke();
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    rectMode(CENTER);
    rect(0, 0, this.radius * 5, this.radius);
    pop();
  }

  drawPerceptionRadius() {
    noFill();
    stroke(255, 0, 0);
    ellipse(
      this.position.x,
      this.position.y,
      this.perceptionRadius * 2,
      this.perceptionRadius * 2
    );
  }

  connectEdges() {
    if (this.position.x > width) {
      this.position.x = width - 10;
      this.velocity.x *= -this.maxSpeed;
    } else if (this.position.x < 0) {
      this.position.x = 10;
      this.velocity.x *= -this.maxSpeed;
    }

    if (this.position.y > height) {
      this.position.y = height - 10;
      this.velocity.y *= -this.maxSpeed;
    } else if (this.position.y < 0) {
      this.position.y = 10;
      this.velocity.y *= -this.maxSpeed;
    }

    this.velocity.limit(this.maxSpeed);
  }

  calculateFlockingForce(snapshot) {
    let flockingForce = {
      alignmentForce: createVector(),
      cohesionForce: createVector(),
      separationForce: createVector(),
    };
    let totalBoidsInPerceptionRadius = 0;

    // align:
    const totalVelocity = createVector();

    // cohesion:
    const totalPosition = createVector();

    // separation:
    const totalForce = createVector();

    for (let boid of snapshot) {
      const distance = this.position.dist(boid.position);

      if (distance < this.perceptionRadius && boid !== this) {
        totalBoidsInPerceptionRadius++;

        // align:
        totalVelocity.add(boid.velocity);

        // cohesion:
        totalPosition.add(boid.position);

        // separation:
        // opposite vector:
        const difference = p5.Vector.sub(this.position, boid.position);
        // inversely proportionate:
        difference.div(distance <= 1 ? 1 : distance);

        totalForce.add(difference);
      }
    }

    ///////////////// wall separation:
    const wallSeq = [
      [0, this.position.y],
      [this.position.x, 0],
      [width, this.position.y],
      [this.position.x, height],
    ];

    for (let wall of wallSeq) {
      let wallVec = createVector(...wall);
      let d = p5.Vector.dist(wallVec, this.position);
      if (d < this.perceptionRadius) {
        // extra separation:
        // opposite vector:
        const difference = p5.Vector.sub(this.position, wallVec);
        // inversely proportionate:
        difference.div(d <= 1 ? 1 : d);

        totalForce.add(difference);
      }
    }
    //////////////////////////////////

    if (totalBoidsInPerceptionRadius > 0) {
      // align:
      // average or desired velocity:
      const avgVelocity = p5.Vector.div(
        totalVelocity,
        totalBoidsInPerceptionRadius
      );
      avgVelocity.setMag(this.maxSpeed);

      const alignmentSteeringForce = p5.Vector.sub(avgVelocity, this.velocity);

      flockingForce.alignmentForce = alignmentSteeringForce;

      // cohesion:
      // average or desired position:
      const avgPosition = p5.Vector.div(
        totalPosition,
        totalBoidsInPerceptionRadius
      );

      const desiredVelocity = p5.Vector.sub(avgPosition, this.position);
      desiredVelocity.setMag(this.maxSpeed);

      const cohesionSteeringForce = p5.Vector.sub(
        desiredVelocity,
        this.velocity
      );

      flockingForce.cohesionForce = cohesionSteeringForce;

      // separation:
      // average or desired force:
      const avgForce = p5.Vector.div(totalForce, totalBoidsInPerceptionRadius);
      avgForce.setMag(this.maxSpeed);

      const separationSteeringForce = p5.Vector.sub(avgForce, this.velocity);

      flockingForce.separationForce = separationSteeringForce;
    }
    return flockingForce;
  }
}
