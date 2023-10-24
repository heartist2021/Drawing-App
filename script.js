document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let drawingHistory = [];
    let redoHistory = [];

    const backgroundColorInput = document.getElementById('backgroundColor');
    const penColorInput = document.getElementById('penColor');
    const undoButton = document.getElementById('undoButton');
    const redoButton = document.getElementById('redoButton');
    const clearButton = document.getElementById('clearButton');
    const saveButton = document.getElementById('saveButton');

    backgroundColorInput.addEventListener('input', changeBackgroundColor);
    penColorInput.addEventListener('input', changePenColor);
    undoButton.addEventListener('click', undoDrawing);
    redoButton.addEventListener('click', redoDrawing);
    clearButton.addEventListener('click', clearDrawing);
    saveButton.addEventListener('click', saveDrawing);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = penColorInput.value;

        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

        // Save current state for undo
        drawingHistory.push(context.getImageData(0, 0, canvas.width, canvas.height));
        redoHistory = [];
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    function undoDrawing() {
        if (drawingHistory.length > 1) {
            redoHistory.push(drawingHistory.pop());
            restoreDrawing();
        }
    }

    function redoDrawing() {
        if (redoHistory.length > 0) {
            drawingHistory.push(redoHistory.pop());
            restoreDrawing();
        }
    }

    function restoreDrawing() {
        context.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    }

    function clearDrawing() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawingHistory = [];
        redoHistory = [];
    }

    function saveDrawing() {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        tempContext.fillStyle = backgroundColorInput.value;
        tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempContext.drawImage(canvas, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'drawing.png';
        link.click();
    }

    function changeBackgroundColor() {
        canvas.style.backgroundColor = backgroundColorInput.value;
    }

    function changePenColor() {
        // Update pen color immediately
        context.strokeStyle = penColorInput.value;
    }
});
