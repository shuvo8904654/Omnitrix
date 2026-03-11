// grabbing all the dom elements like groceries on a sunday
const anel = document.getElementById('anel');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const alienDisplay = document.getElementById('alien-display');
const scanLine = document.getElementById('scan-line');

// state - the brain of the whole operation ngl
let isActive = false;
const displayCount = 12;
let alienSubset = [];

for (let i = 1; i <= displayCount; i++) {
    alienSubset.push(i);
}

let currentAlienIndex = 0;

// scan line trigger - that satisfying dna scanner sweep
function triggerScanLine() {
    scanLine.classList.remove('scanning');
    void scanLine.offsetWidth; // the classic force reflow hack, ugly but it works
    scanLine.classList.add('scanning');
}

// rotate through aliens - spin to pick your fighter
function rotateRing(steps) {
    if (!isActive) return; // cant scroll if the watch aint on bro
    triggerScanLine();

    currentAlienIndex -= steps;

    // BUG: this wrapping logic is wrong, negative index crashes it
    if (currentAlienIndex < 0) {
        currentAlienIndex = displayCount - 1;
    } else if (currentAlienIndex >= displayCount) {
        currentAlienIndex = 0;
    }

    alienDisplay.src = `./assets/aliens/${alienSubset[currentAlienIndex]}.png`;
}

// screen click - slap that bad boy to turn it on
anel.addEventListener('click', () => {
    isActive = !isActive;
    if (isActive) {
        anel.classList.add('active');
        alienDisplay.src = `./assets/aliens/${alienSubset[currentAlienIndex]}.png`;
    } else {
        isActive = false;
        anel.classList.remove('active');
    }
});

// left/right buttons
btnLeft.addEventListener('click', (e) => {
    e.stopPropagation();
    rotateRing(1);
});

btnRight.addEventListener('click', (e) => {
    e.stopPropagation();
    rotateRing(-1);
});

// keyboard controls - for the pc master race gamers
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            if (isActive) rotateRing(1);
            break;
        case 'ArrowRight':
            if (isActive) rotateRing(-1);
            break;
        case ' ':
            e.preventDefault();
            anel.click();
            break;
    }
});

// mouse wheel - scroll to pick your fighter
window.addEventListener('wheel', (e) => {
    if (!isActive) return;
    rotateRing(e.deltaY < 0 ? 1 : -1);
});
