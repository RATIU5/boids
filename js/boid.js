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

        fill(
            this.color.levels[0],
            this.color.levels[1],
            this.color.levels[2],
            20
        );
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

    update(maxSpeed) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.limit(maxSpeed);
        this.acc.mult(0);
    }
}
