(function () {
    const canvas = document.getElementById('dampedCanvas');
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
    const damperX = width / 2;

    let X = fixedX - 100;
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
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }
    animate();

    function resetX() {
        X = fixedX - 100;
        setTimeout(resetX, 5000);
    }
    setTimeout(resetX, 5000); 
})();
