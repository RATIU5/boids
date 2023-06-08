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
    }

    update(maxSpeed) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.limit(maxSpeed);
        this.acc.mult(0);
    }
}
