const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext("2d");
const width = 650;
const height = 450;
canvas.width = width;
canvas.height = height;

// Load the hidden image
const scratchImage = new Image();
scratchImage.src ='bg3.jpg'; //'https://cdn.pixabay.com/photo/2022/01/25/01/23/valenties-day-card-6965107_1280.png';

scratchImage.onload = () => {
    ctx.drawImage(scratchImage, 0, 0, width, height);
};


// Set up the scratch effect
let isDrawing = false;
let brushSize = 25;
let lastX, lastY; // To track the last mouse position

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX; // Initialize lastX and lastY when drawing starts
    lastY = e.offsetY; // Initialize lastX and lastY when drawing starts
});

canvas.addEventListener('mouseup', (e) => {
    isDrawing = false;
    checkScratchCompletion();
});

canvas.addEventListener('mousemove', scratchEffect);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const touch = e.touches[0];
    lastX = touch.clientX - canvas.offsetLeft;
    lastY = touch.clientY - canvas.offsetTop;
});

canvas.addEventListener('touchend',() => {
    isDrawing = false;
    checkScratchCompletion();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    scratchEffect({
        clientX: touch.clientX,
        clientY: touch.clientY
    });
});

function scratchEffect(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.offsetX !== undefined) ? e.offsetX : e.clientX - rect.left;
    const y = (e.offsetY !== undefined) ? e.offsetY : e.clientY - rect.top;

    const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
    const speedFactor = Math.max(distance / 10, 1);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize * speedFactor, 0, Math.PI * 2);
    ctx.fill();

    lastX = x;
    lastY = y;
}


function checkScratchCompletion() {
    const imageData = ctx.getImageData(0, 0, width, height);
    let scratched = 0;

    for(let i =0; i< imageData.data.length; i += 4) 
    {
        if(imageData.data[i+3] < 128)
        {
            scratched++;
        }
    }

    const scratchedPercentage = (scratched / (width * height)) * 100;

    if(scratchedPercentage > 60) 
    {
        triggerConfetti();
    }
};