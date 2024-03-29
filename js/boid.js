class Boid {
  pos = createVector(0, 0);
  vel = createVector(0, 0);
  acc = createVector(0, 0);
  perceptionRadius = 30;
  color = color(255);
  scale = 1;

  constructor(boid) {
    this.pos = boid.pos;
    this.vel = boid.vel;
    this.perceptionRadius = boid.perceptionRadius;
    this.color = boid.color;
    this.scale = boid.scale;
  }

  draw() {
    fill(this.color);
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2);
    const scale = this.scale;
    beginShape();
    vertex(0 * scale, -7 * scale);
    vertex(-3 * scale, 7 * scale);
    vertex(0, 5 * scale);
    vertex(3 * scale, 7 * scale);
    endShape(CLOSE);
    pop();

    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 20);
    ellipse(this.pos.x, this.pos.y, (this.perceptionRadius * scale) / 2);
  }

  bounce() {
    const x = this.pos.x;
    const y = this.pos.y;

    if (x < 0 || x > width) {
      this.vel.x = this.vel.x * -1;
    }

    if (y < 0 || y > height) {
      this.vel.y = this.vel.y * -1;
    }
  }

  wrap(min, max) {
    const x = this.pos.x;
    const y = this.pos.y;
    const off = (this.perceptionRadius * this.scale) / 2;

    if (x < min.x - off) {
      this.pos.x = max.x + off;
    } else if (x > max.x + off) {
      this.pos.x = min.x - off;
    }

    if (y < min.y - off) {
      this.pos.y = max.y + off;
    } else if (y > max.y + off) {
      this.pos.y = min.y - off;
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  createBoidForce() {
    return [createVector(0, 0), 0];
  }

  assignSeparationForce(flockmate, boidForce, perceptionRadius) {
    const radius = perceptionRadius ?? this.perceptionRadius;
    const [force] = boidForce;

    let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

    if (d < radius) {
      const diff = p5.Vector.sub(this.pos, flockmate.pos);
      diff.div(d);
      force.add(diff);

      boidForce[0].add(diff);
      boidForce[1]++;
    }
  }

  applySeparationForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
    const [force, count] = boidForce;
    if (count > 0) {
      force.div(count);
      force.mult(maxSpeed);
      force.sub(this.vel);
      force.limit(maxForce);
      this.applyForce(force);
    }
  }

  assignAlignmentForce(flockmate, boidForce, perceptionRadius) {
    const radius = perceptionRadius ?? this.perceptionRadius;
    let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

    if (d < radius) {
      boidForce[0].add(flockmate.vel);
      boidForce[1]++;
    }
  }

  applyAlignmentForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
    const [force, count] = boidForce;
    if (count > 0) {
      force.div(count);
      force.setMag(maxSpeed);
      force.sub(this.vel);
      force.limit(maxForce);
      this.applyForce(force);
    }
  }

  assignCohesionForce(flockmate, boidForce, perceptionRadius) {
    const radius = perceptionRadius ?? this.perceptionRadius;
    let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

    if (d < radius) {
      boidForce[0].add(flockmate.pos);
      boidForce[1]++;
    }
  }

  applyCohesionForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
    const [force, count] = boidForce;
    if (count > 0) {
      force.div(count);
      force.sub(this.pos);
      force.setMag(maxSpeed);
      force.sub(this.vel);
      force.limit(maxForce);
      this.applyForce(force);
    }
  }

  avoidPointForce(vector, maxForce = 0.2, maxSpeed = 4, perceptionRadius) {
    const radius = perceptionRadius ?? this.perceptionRadius;
    let d = dist(this.pos.x, this.pos.y, vector.x, vector.y);
    const steering = createVector(0, 0);
    let count = 0;

    if (d < radius) {
      const diff = p5.Vector.sub(this.pos, vector);
      diff.div(d);
      steering.add(diff);
      count++;
    }

    if (count > 0) {
      steering.div(count);
      steering.setMag(maxSpeed);
      steering.sub(this.vel);
      steering.limit(maxForce);
    }
    this.applyForce(steering);
  }

  towardPointForce(vector, maxForce = 0.2, maxSpeed = 4, perceptionRadius) {
    const radius = perceptionRadius || this.perceptionRadius;
    const steering = createVector(0, 0);
    let count = 0;
    let d = dist(this.pos.x, this.pos.y, vector.x, vector.y);

    if (d < radius) {
      const diff = p5.Vector.sub(this.pos, vector);
      diff.div(-1 / d);
      steering.add(diff);
      count++;
    }

    if (count > 0) {
      steering.div(count);
      steering.setMag(maxSpeed);
      steering.sub(this.vel);
      steering.limit(maxForce);
    }
    this.applyForce(steering);
  }

  update(maxSpeed) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(maxSpeed);
    this.acc.mult(0);
  }
}
