// grabbing all the dom elements like groceries on a sunday
const anel = document.getElementById('anel');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const alienDisplay = document.getElementById('alien-display');
const scanLine = document.getElementById('scan-line');
const particlesContainer = document.getElementById('particles-container');

// sound system - because what's an omnitrix without the satisfying clicks
let soundEnabled = true;
const selectSound = new Audio('./assets/sounds/alienselection.mp3');
const transformSound = new Audio('./assets/sounds/transformation.mp3');

function playSound(type) {
    if (!soundEnabled) return; // respect the mute button bestie
    if (type === 'cycle') {
        selectSound.currentTime = 0;
        selectSound.play().catch(() => {}); // browsers be blocking autoplay smh
    } else if (type === 'transform') {
        transformSound.currentTime = 0;
        transformSound.play().catch(() => {});
    }
}

// state - the brain of the whole operation ngl
let isActive = false;
const displayCount = 12;
let alienSubset = [];

for (let i = 1; i <= displayCount; i++) {
    alienSubset.push(i);
}

let currentAlienIndex = 0;

// timeout - bro forgot to use the watch so we shut it down
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 15000; // 15 seconds of doing nothing and its bedtime

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (isActive) {
        inactivityTimer = setTimeout(() => {
            powerDown();
        }, INACTIVITY_TIMEOUT);
    }
}

function powerDown() {
    if (!isActive) return;
    isActive = false;
    anel.classList.remove('active');
    particlesContainer.classList.remove('active');
    clearTimeout(inactivityTimer);
}

// particles - the little floaty bits that make everything look 10x cooler
function createParticles() {
    particlesContainer.innerHTML = '';
    const count = 20;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${40 + Math.random() * 40}%`;
        p.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);
        p.style.animationDuration = `${2 + Math.random() * 3}s`;
        p.style.animationDelay = `${Math.random() * 3}s`;
        p.style.width = `${2 + Math.random() * 4}px`;
        p.style.height = p.style.width;
        particlesContainer.appendChild(p);
    }
}
createParticles();

// scan line trigger - that satisfying dna scanner sweep
function triggerScanLine() {
    scanLine.classList.remove('scanning');
    void scanLine.offsetWidth; // the classic force reflow hack, ugly but it works
    scanLine.classList.add('scanning');
}

// flash div - the screen goes white like you just looked at the sun
const flashDiv = document.createElement('div');
flashDiv.classList.add('transform-flash');
document.body.appendChild(flashDiv);

// rotate through aliens
function rotateRing(steps) {
    if (!isActive) return;
    playSound('cycle');
    resetInactivityTimer();
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

// transform - ITS HERO TIME
function triggerTransform() {
    playSound('transform');
    clearTimeout(inactivityTimer);

    // the dramatic silhouette moment, you know the one
    anel.classList.add('transforming');
    flashDiv.classList.add('active');

    setTimeout(() => {
        anel.classList.remove('transforming');
        flashDiv.classList.remove('active');
        isActive = false;
        anel.classList.remove('active');
        particlesContainer.classList.remove('active');
    }, 1200);
}

// screen click - slap that bad boy to turn it on
anel.addEventListener('click', () => {
    isActive = !isActive;
    if (isActive) {
        playSound('cycle');
        anel.classList.add('active');
        alienDisplay.src = `./assets/aliens/${alienSubset[currentAlienIndex]}.png`;
        particlesContainer.classList.add('active');
        resetInactivityTimer();
    } else {
        powerDown();
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
        case 'Enter':
        case ' ':
            e.preventDefault();
            if (isActive) {
                triggerTransform();
            } else {
                anel.click();
            }
            break;
        case 'Escape':
            if (isActive) {
                powerDown();
            }
            break;
    }
});

// mouse wheel - scroll to pick your fighter
window.addEventListener('wheel', (e) => {
    if (!isActive) return;
    rotateRing(e.deltaY < 0 ? 1 : -1);
});

// touch swipe - for the mobile gang
let touchStartX = null;
let touchStartY = null;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (touchStartX === null || !isActive) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        rotateRing(dx > 0 ? 1 : -1);
    }
}, { passive: true });
