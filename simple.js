const canvas = document.getElementById('vibrationCanvas');
const ctx = canvas.getContext('2d');
const ditButton = document.getElementById('ditButton');
const slider = document.getElementById('slider');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (!audioContext) {
    console.error('No Web audio available.');
}

const width = 800;
const height = 600;
canvas.width = width;
canvas.height = height;

let fixedX = width / 2;
const fixedVelocityX = 400;
const fixedY = 500;
const rodLength = 400;
const weightMass = 1;
const springConstant = 50;
let dt = 0.01;
let inDit = false;
const damperX = width / 2;
const ditShiftX = 100;

let X = fixedX;
let velocityX = 0;
let history = [];

function push_history(v) {
    history.push(v);
    if (history.length > rodLength) {
        history.shift();
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // mount
    ctx.fillStyle = '#666';
    ctx.fillRect(fixedX - 20, fixedY -10, 40, 20);

    // rod
    ctx.lineWidth = 4;
    ctx.strokeStyle= '#333';
    ctx.beginPath();
    ctx.moveTo(fixedX, fixedY);
    // ctx.lineTo(X, fixedY - rodLength);
    ctx.bezierCurveTo(
        fixedX, fixedY - rodLength,
        X, fixedY - rodLength,
        X, fixedY - rodLength
    );
    ctx.stroke();

    // weight
    ctx.fillStyle = '#ff6347';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a0522d';
    ctx.beginPath();
    ctx.arc(X, fixedY - rodLength, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    // graph
    ctx.lineWidth = 1;
    let graphY = fixedY - rodLength;
    for (let i = history.length - 1; i > 0; i--) {
        if (history[i] < (width / 2 - ditShiftX)) {
            ctx.strokeStyle = '#f33';
        } else {
            ctx.strokeStyle = '#ccc';
        }
        ctx.beginPath();
        ctx.moveTo(history[i], graphY);
        ctx.lineTo(history[i + 1], graphY + 1);
        graphY++;
        ctx.stroke();
    }
}

function update() {
    // move fixed point
    if (inDit) {
        if (fixedX > (width / 2) - ditShiftX) {
            fixedX -= fixedVelocityX * dt;
        }
    } else {
        if (fixedX < (width / 2)) {
            fixedX += fixedVelocityX * dt;
        }
    }        

    // F = -springConstant * displacement
    let force = -springConstant * (X - fixedX);

    // acceleration = F / m
    let acc = force / weightMass;

    // dv = acc * dt
    velocityX += acc * dt;

    // dx = dv * dt;
    X += velocityX * dt;

    // damp
    if (X > damperX) {
        X = damperX;
        velocityX = -velocityX/10;
    }
    push_history(X);

    // tone if we are in the right place.
    if (X < (width / 2 - ditShiftX)) {
        toneOn();
    } else {
        toneOff();
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

let oscillator = null;

function toneOn() {
    if (!audioContext) {
        return;
    }
    if (!oscillator) {
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
    }
}

function toneOff() {
    if (oscillator) {
        oscillator.stop(audioContext.currentTime + 0.05);
        oscillator = null;
    }
}

ditButton.addEventListener('mousedown', () => {
    inDit = true;
});
ditButton.addEventListener('mouseup', () => {
    inDit = false;
});
ditButton.addEventListener('touchstart', () => {
    inDit = true;
});
ditButton.addEventListener('touchend', () => {
    inDit = false;
});

slider.addEventListener('input', (event) => {
    dt = event.target.value / 2000;
});

animate();
