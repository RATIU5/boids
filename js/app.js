function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(10);
}

function spawnBoids(amount) {
    let flock = [];
    for (let i = 0; i < amount; i++) {
        const boid = new Boid();
        flock.push(boid);
    }

    return flock;
}
