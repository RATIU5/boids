let i = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    i++;
    background(100, 200, 150);

    fill(100, 250, 5);
    ellipse(i, 300, 100, i);
}
