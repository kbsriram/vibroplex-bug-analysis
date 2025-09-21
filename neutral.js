(function () {
    const canvas = document.getElementById('neutralCanvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const fixedX = width / 2;
    const fixedY = 500;
    const rodLength = 400;
    const weightMass = 1;
    const springConstant = 50;
    let dt = 0.01;

    let X = fixedX - 100;
    let velocityX = 0;

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
    }

    function update() {
        // F = -springConstant * displacement
        let force = -springConstant * (X - fixedX);

        // acceleration = F / m
        let acc = force / weightMass;

        // dv = acc * dt
        velocityX += acc * dt;

        // dx = dv * dt;
        X += velocityX * dt;
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }
    animate();
})();
