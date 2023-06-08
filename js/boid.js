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
        this.acc = boid.acc;
        this.perceptionRadius = boid.perceptionRadius;
        this.color = boid.color;
        this.scale = boid.scale;
    }

    draw() {
        fill(30, 40, 100);
        noStroke();

        ellipse(
            this.pos.x,
            this.pos.y,
            this.pos.perceptionRadius,
            this.pos.perceptionRadius
        );
    }

    update(maxSpeed) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.limit(maxSpeed);
        this.acc.mult(0);
    }
}
