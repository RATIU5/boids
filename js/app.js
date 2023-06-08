const flock = spawnBoids(100);

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(10);

    for (const boid of flock) {
        boid.update(4);
        boid.draw();
    }
}

function spawnBoids(amount) {
    let flock = [];
    for (let i = 0; i < amount; i++) {
        const vel = p5.Vector.random2D();
        vel.setMag(random(1, 5));

        const boid = new Boid({
            pos: createVector(random(width), random(height)),
        });
        flock.push(boid);
    }

    return flock;
}
