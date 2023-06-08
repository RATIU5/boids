class Boid {
    pos = createVector(0, 0);
    vel = createVector(0, 0);
    acc = createVector(0, 0);
    perceptionRadius = 30;

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
}
