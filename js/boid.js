let dev = false;

class Boid {
	/**
	 * @type {p5.Vector}
	 */
	pos = createVector(0, 0);
	/**
	 * @type {p5.Vector}
	 */
	vel = createVector(0, 0);
	/**
	 * @type {p5.Vector}
	 */
	acc = createVector(0, 0);

	perceptionRadius = 30;
	/**
	 * @type {p5.Color}
	 */
	color = color(255);

	scale = 1;

	/**
	 * Create a boid object with a position, velocity, and acceleration.
	 *
	 * Optional parameters are the perception radius, color, and scale - each
	 * with their own default value.
	 *
	 * The perceptionRadius' limits the distance at which boids will align with each other.
	 *
	 * @param {object} boid
	 * @param {p5.Vector} boid.pos - position of the boid
	 * @param {p5.Vector?} boid.vel - velocity of the boid
	 * @param {p5.Vector?} boid.acc - acceleration of the boid
	 * @param {number?} boid.perceptionRadius - perception radius of the boid
	 * @param {number?} boid.scale - scale of the boid
	 * @param {p5.Color?} boid.color - color of the boid
	 * @returns {boid} boid object
	 */
	constructor(boid) {
		this.scale = boid.scale || this.scale;
		this.pos = boid.pos || this.pos;
		this.vel = boid.vel || this.vel;
		this.acc = boid.acc || this.acc;
		this.perceptionRadius = boid.perceptionRadius || this.perceptionRadius;
		this.color = boid.color || this.color;
	}

	update(maxSpeed) {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.limit(maxSpeed);
		this.acc.mult(0);
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
		vertex(0 * scale, 5 * scale);
		vertex(3 * scale, 7 * scale);
		endShape(CLOSE);
		pop();

		if (dev) {
			fill(255, 10);
			ellipse(
				this.pos.x,
				this.pos.y,
				this.perceptionRadius,
				this.perceptionRadius,
			);
		}
	}
	wrap(min, max, bleed = 4) {
		const x = this.pos.x;
		const y = this.pos.y;

		if (x < min.x - bleed) {
			this.pos.x = max.x + bleed;
		} else if (x > max.x + bleed) {
			this.pos.x = min.x - bleed;
		}
		if (y < min.y - bleed) {
			this.pos.y = max.y + bleed;
		} else if (y > max.y + bleed) {
			this.pos.y = min.y - bleed;
		}
	}

	/**
	 * Apply a force to the boid.
	 * (By adding the force to the acceleration)
	 * @param {p5.Vector} force
	 */
	applyForce(force) {
		this.acc.add(force);
	}

	/**
	 * Initialize a new boid force, an array with a vector and a count number.
	 * @returns [p5.Vector, number] - the steering vector and the number of flockmates within the perception radius
	 */
	createBoidForce() {
		return [createVector(0, 0), 0];
	}

	/**
	 * Calculate and assign the steering force for the boid.
	 * It adjusts the boid force vector to steer away from all flockmates within the perception radius, and the number of flockmates within that perception radius.
	 * @param {Boid} flockmate
	 * @param {[p5.Vector, number]} boidForce
	 * @param {number?} perceptionRadius
	 */
	assignSeparationForce(flockmate, boidForce, perceptionRadius = undefined) {
		const radius = perceptionRadius ?? this.perceptionRadius;
		const [force] = boidForce;

		let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

		// If the flockmate is within the perception radius, add its position to the steering vector.
		if (d < radius) {
			// Get the vector between the boid and the flockmate towards the boid.
			const diff = p5.Vector.sub(this.pos, flockmate.pos);
			// Inversely proportional to the distance between the boid and the flockmate.
			diff.div(d);
			// Add all the inverse flockmate positions to the steering vector.
			force.add(diff);

			boidForce[0].add(diff);
			boidForce[1]++;
		}
	}

	/**
	 * Calculate and assign the steering force for the boid.
	 * It adjusts the boid force vector to steer in the same direction of all flockmate directions within the perception radius.
	 * @param {Boid} flockmate
	 * @param {[p5.Vector, number]} boidForce
	 * @param {number?} perceptionRadius
	 */
	assignAlignmentForce(flockmate, boidForce, perceptionRadius = undefined) {
		const radius = perceptionRadius ?? this.perceptionRadius;
		let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

		if (d < radius) {
			boidForce[0].add(flockmate.vel);
			boidForce[1]++;
		}
	}

	/**
	 * Calculate and assign the steering force for the boid.
	 * It adjusts the boid force vector to steer toward the center of all flockmates within the perception radius.
	 * @param {Boid} flockmate
	 * @param {[p5.Vector, number][p5.Vector, number][p5.Vector, number]} boidForce
	 * @param {number?} perceptionRadius
	 */
	assignCohesionForce(flockmate, boidForce, perceptionRadius = undefined) {
		const radius = perceptionRadius ?? this.perceptionRadius;
		let d = dist(this.pos.x, this.pos.y, flockmate.pos.x, flockmate.pos.y);

		if (d < radius) {
			boidForce[0].add(flockmate.pos);
			boidForce[1]++;
		}
	}

	/**
	 * Apply the separation force to the boid's acceleration.
	 * @param {[p5.Vector, number]} boidForce
	 * @param {number} maxForce
	 * @param {number} maxSpeed
	 */
	applySeparationForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
		const [force, count] = boidForce;
		if (count > 0) {
			force.div(count);
			force.mult(maxSpeed);
			force.sub(this.vel);
			force.limit(maxForce);
			this.applyForce(force);
		}
	}

	/**
	 * Apply the alignment force to the boid's acceleration.
	 * @param {[p5.Vector, number]} boidForce
	 * @param {number} maxForce
	 * @param {number} maxSpeed
	 */
	applyAlignmentForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
		const [force, count] = boidForce;
		if (count > 0) {
			force.div(count);
			force.setMag(maxSpeed);
			force.sub(this.vel);
			force.limit(maxForce);
			this.applyForce(force);
		}
	}

	/**
	 * Apply the cohesion force to the boid's acceleration.
	 * @param {[p5.Vector, number]} boidForce
	 * @param {number} maxForce
	 * @param {number} maxSpeed
	 */
	applyCohesionForce(boidForce, maxForce = 0.2, maxSpeed = 4) {
		const [force, count] = boidForce;
		if (count > 0) {
			force.div(count);
			force.sub(this.pos);
			force.setMag(maxSpeed);
			force.sub(this.vel);
			force.limit(maxForce);
			this.applyForce(force);
		}
	}

	/**
	 * Apply an away force to the boid's acceleration if within the perception radius.
	 * @param {p5.Vector} vector
	 * @param {number} maxForce
	 * @param {number} maxSpeed
	 */
	applyAvoidPointForce(
		vector,
		maxForce = 0.2,
		maxSpeed = 4,
		perceptionRadius = undefined,
	) {
		const radius = perceptionRadius ?? this.perceptionRadius;
		const steering = createVector(0, 0);
		let count = 0;

		let d = dist(this.pos.x, this.pos.y, vector.x, vector.y);

		// If the flockmate is within the perception radius, add its position to the steering vector.
		if (d < radius) {
			// Get the vector between the boid and the point towards the boid.
			const diff = p5.Vector.sub(this.pos, vector);
			// Inversely proportional to the distance between the boid and the point.
			diff.div(d);

			steering.add(diff);

			count++;
		}

		// If boid is within the radius of the point
		if (count > 0) {
			steering.div(count);

			// Set the speed of the steering force
			steering.setMag(maxSpeed);

			// Steering is the desired velocity minus the current velocity.
			steering.sub(this.vel);

			// Limit the steering vector to the boid's maximum steering force.
			steering.limit(maxForce);
		}

		this.applyForce(steering);
	}
}
