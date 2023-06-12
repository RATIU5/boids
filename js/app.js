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

const MOUSE_RADIUS = 200;

function setup() {
  for (let e of document.querySelectorAll(".p5Canvas")) {
    e.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  createCanvas(windowWidth, windowHeight);

  min = createVector(0, 0);
  max = createVector(width, height);

  spawnBoids(BOID_COUNT);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  max = createVector(windowWidth, windowHeight);
}

let rightPressed = false;
let leftPressed = false;
function mousePressed() {
  if (mouseButton === RIGHT) {
    rightPressed = true;
  } else if (mouseButton === LEFT) {
    leftPressed = true;
  }
}

function mouseReleased() {
  rightPressed = false;
  leftPressed = false;
}

function draw() {
  background(50);

  if (rightPressed) {
    stroke(255, 100, 250);
  }
  if (leftPressed) {
    stroke(255, 200, 50);
  }
  noFill();
  ellipse(mouseX, mouseY, MOUSE_RADIUS, MOUSE_RADIUS);

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

    boid.applySeparationForce(separationForce, SEP_WEIGHT, SEP_SPEED);
    boid.applyAlignmentForce(alignmentForce, ALN_WEIGHT, ALN_SPEED);
    boid.applyCohesionForce(cohesionForce, COS_WEIGHT, COS_SPEED);

    if (leftPressed) {
      boid.avoidPointForce(createVector(mouseX, mouseY), 0.5, 5, MOUSE_RADIUS);
    }

    if (rightPressed) {
      boid.towardPointForce(createVector(mouseX, mouseY), 0.5, 5, MOUSE_RADIUS);
    }

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
