let flock = [];

let min, max;

const BOID_COUNT = 100;
const PERCEPTION_RADIUS = 40;
const SCALE = 2;

const SEP_SIZE = 30;
const ALN_SIZE = 60;
const COS_SIZE = 40;

const SEP_WEIGHT = 0.2;
const ALN_WEIGHT = 0.095;
const COS_WEIGHT = 0.1;

const SEP_SPEED = 3.25;
const ALN_SPEED = 3;
const COS_SPEED = 3;

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

        let separationForce = boid.createBoidForce();
        let alignmentForce = boid.createBoidForce();
        let cohesionForce = boid.createBoidForce();

        for (const flockmate of flock) {
            if (boid == flockmate) continue;
            boid.assignSeparationForce(flockmate, separationForce, SEP_SIZE);
            boid.assignAlignmentForce(flockmate, alignmentForce, ALN_SIZE);
            boid.assignCohesionForce(flockmate, cohesionForce, COS_SIZE);
        }

        boid.applySeparationForce(separationForce, 0.15, SEP_SPEED);
        boid.applyAlignmentForce(alignmentForce, 0.02, ALN_SPEED);
        boid.applyCohesionForce(cohesionForce, 0.095, COS_SPEED);

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
