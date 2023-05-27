const flock = [];

let min, max;

const SEPARATION_SIZE = 30;
const ALIGNMENT_SIZE = 60;
const COHESION_SIZE = 40;

const SEPARATION_WEIGHT = 0.095;
const ALIGNMENT_WEIGHT = 0.2;
const COHESION_WEIGHT = 0.1;

const SEPARATION_SPEED = 3;
const ALIGNMENT_SPEED = 3.25;
const COHESION_SPEED = 3;

function setup() {
	createCanvas(windowWidth, windowHeight);

	min = createVector(0, 0);
	max = createVector(width, height);

	summonBoids(220);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	max = createVector(windowWidth, windowHeight);
}

function draw() {
	background(31);

	for (const boid of flock) {
		// Enable boids to wrap around the screen
		boid.wrap(min, max);

		// Setup boid forces
		let separation = boid.createBoidForce();
		let alignment = boid.createBoidForce();
		let cohesion = boid.createBoidForce();

		for (const flockmate of flock) {
			// Skip if the boid is itself
			if (boid == flockmate) continue;
			// Calculate and assign the forces to the boid forces
			boid.assignSeparationForce(flockmate, separation, SEPARATION_SIZE);
			boid.assignAlignmentForce(flockmate, alignment, ALIGNMENT_SIZE);
			boid.assignCohesionForce(flockmate, cohesion, COHESION_SIZE);
		}
		// Apply the forces to the boid
		boid.applySeparationForce(alignment, SEPARATION_WEIGHT, SEPARATION_SPEED);
		boid.applyAlignmentForce(separation, ALIGNMENT_WEIGHT, ALIGNMENT_SPEED);
		boid.applyCohesionForce(cohesion, COHESION_WEIGHT, COHESION_SPEED);

		if (mouseIsPressed)
			boid.applyAvoidPointForce(
				createVector(mouseX, mouseY),
				0.25,
				5,
				200,
			);

		// Update boid position, velocity, and acceleration
		boid.update(4);
		// Draw the boid to the screen
		boid.draw();
	}
}

function summonBoids(amount) {
	for (let i = 0; i < amount; i++) {
		// Set random velocity
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
}
