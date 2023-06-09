let flock = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    flock = spawnBoids(100);
}

function draw() {
    background(50);

    for (const boid of flock) {
        boid.wrap();
        boid.update(4);
        boid.draw();
    }
}

function spawnBoids(amount) {
    let flock = [];
    for (let i = 0; i < amount; i++) {
        const vel = p5.Vector.random2D();
        vel.setMag(random(1, 5));

        const scale = random(2, 2);

        const boid = new Boid({
            pos: createVector(random(width), random(height)),
            vel: vel,
            perceptionRadius: 50,
            scale: scale,
            color: color(random(50, 255), random(50, 255), 100),
        });
        flock.push(boid);
    }
    return flock;
}
