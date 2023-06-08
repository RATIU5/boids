let flock = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    flock = spawnBoids(100);
}

function draw() {
    background(50);

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
            vel: vel,
            perceptionRadius: 50,
            scale: 1.5,
            color: color(random(50, 255), random(50, 255), 100),
        });
        flock.push(boid);
    }
    console.log(flock.length);
    return flock;
}
