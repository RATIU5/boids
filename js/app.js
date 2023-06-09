let flock = [];

let min, max;

const BOID_COUNT = 200;
const PERCEPTION_RADIUS = 40;
const SCALE = 2;

function setup() {
    createCanvas(windowWidth, windowHeight);

    min = createVector(0, 0);
    max = createVector(width, height);

    spawnBoids(BOID_COUNT);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    max = createVector(windowWidth, windowHeight);
}

function draw() {
    background(50);

    for (const boid of flock) {
        boid.wrap(min, max);
        boid.applyForce(createVector(0, 0.1));
        boid.update(4);
        boid.draw();
    }
}

function spawnBoids(amount) {
    for (let i = 0; i < amount; i++) {
        const vel = p5.Vector.random2D();
        vel.setMag(random(1, 5));

        const boid = new Boid({
            pos: createVector(random(width), random(height)),
            vel: vel,
            perceptionRadius: PERCEPTION_RADIUS,
            scale: SCALE,
            color: color(random(50, 255), random(50, 255), 100),
        });
        flock.push(boid);
    }
}
