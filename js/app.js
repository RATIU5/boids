let flock = [];

let min, max;

const BOID_COUNT = 10;
const PERCEPTION_RADIUS = 40;
const SCALE = 2;

const SEP_SIZE = 30;
const ALN_SIZE = 60;
const COS_SIZE = 40;

const SEP_WEIGHT = 0.5;
const ALN_WEIGHT = 0.095;
const COS_WEIGHT = 0.1;

const SEP_SPEED = 3.25;
const ALN_SPEED = 3;
const COS_SPEED = 3;

const MOUSE_RADIUS = 200;

const BOOST_SPEED = 10;

let boost = false;
let scaleSlider;
let alnWSlider;
let alnSSlider;
function setup() {
  scaleSlider = createSlider(0, 10, 1);
  scaleSlider.position(10, 10);
  scaleSlider.style("width", "150px");

  alnWSlider = createSlider(0, 1, 0.01, 0.01);
  alnWSlider.position(10, 30);
  alnWSlider.style("width", "150px");

  alnSSlider = createSlider(0, 4, 8, 0.5);
  alnSSlider.position(10, 60);
  alnSSlider.style("width", "150px");

  for (let e of document.querySelectorAll(".p5Canvas")) {
    e.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  createCanvas(windowWidth, windowHeight);

  min = createVector(0, 0);
  max = createVector(width, height);

  spawnBoids(BOID_COUNT);
}

function keyPressed() {
  if (keyCode === 83) {
    if (flock.length < 300) {
      spawnBoids(10);
    }
  }

  if (keyCode === 68) {
    flock.splice(0, 10);
  }

  if (keyCode === 66) {
    boost = true;

    setTimeout(() => {
      boost = false;
    }, 1000);
  }
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

  text("Scale", 10, 10);

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

    boid.applySeparationForce(
      separationForce,
      SEP_WEIGHT,
      boost ? BOOST_SPEED : SEP_SPEED
    );
    boid.applyAlignmentForce(
      alignmentForce,
      alnWSlider.value(),
      boost ? BOOST_SPEED : ALN_SPEED
    );
    boid.applyCohesionForce(
      cohesionForce,
      COS_WEIGHT,
      boost ? BOOST_SPEED : COS_SPEED
    );

    if (leftPressed) {
      boid.avoidPointForce(createVector(mouseX, mouseY), 0.5, 5, MOUSE_RADIUS);
    }

    if (rightPressed) {
      boid.towardPointForce(createVector(mouseX, mouseY), 0.5, 5, 500);
    }

    boid.update(boost ? BOOST_SPEED : 4);
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
      scale: scaleSlider.value(),
      color: color(random(50, 255), random(50, 255), 100),
    });
    flock.push(boid);
  }
}
