// grabbing all the dom elements like groceries on a sunday
const anel = document.getElementById('anel');
const holoRing = document.getElementById('holo-ring');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const alienDisplay = document.getElementById('alien-display');
const scanLine = document.getElementById('scan-line');
const particlesContainer = document.getElementById('particles-container');
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const randomBtn = document.getElementById('random-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const favBtn = document.getElementById('fav-btn');
const favIcon = document.getElementById('fav-icon');
const infoPanel = document.getElementById('alien-info-panel');
const infoClose = document.getElementById('info-close');
const infoAlienImg = document.getElementById('info-alien-img');
const infoAlienName = document.getElementById('info-alien-name');
const infoAlienDesc = document.getElementById('info-alien-desc');
const infoFavIndicator = document.getElementById('info-fav-indicator');

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

// favorites - your personal alien tier list basically
let favorites = JSON.parse(localStorage.getItem('omnitrix-favorites') || '[]');

function saveFavorites() {
    localStorage.setItem('omnitrix-favorites', JSON.stringify(favorites));
}

function isFavorited(alienNum) {
    return favorites.includes(alienNum);
}

function toggleFavorite(alienNum) {
    if (isFavorited(alienNum)) {
        favorites = favorites.filter(n => n !== alienNum);
    } else {
        favorites.push(alienNum);
    }
    saveFavorites();
    updateFavBtn();
    updateHighlights();
}

function updateFavBtn() {
    const currentAlien = alienSubset[currentAlienIndex];
    favIcon.textContent = isFavorited(currentAlien) ? 'â˜…' : 'â˜†';
}

// state - the brain of the whole operation ngl
let isActive = false;
let isAlbedo = false; // evil twin mode lol
const totalAliens = 86; // yeah we got the whole roster
const displayCount = 12;
let alienSubset = [];

for (let i = 1; i <= displayCount; i++) {
    alienSubset.push(i);
}

let currentAlienIndex = 0;
let ringRotation = 0;
const anglePerSegment = 360 / displayCount;

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
    holoRing.style.opacity = '0';
    holoRing.style.transform = `scale(0.5) rotate(${ringRotation}deg)`;
    clearTimeout(inactivityTimer);
    window.dispatchEvent(new CustomEvent('omnitrix-powerdown')); // goodnight sweet prince
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

// build the holographic ring - the circle of alien goodness
function buildRing() {
    holoRing.innerHTML = ''; // out with the old
    const radius = 285; // pixel perfect circle, trust

    alienSubset.forEach((alienNum, index) => {
        const seg = document.createElement('div');
        seg.classList.add('holo-segment');

        const angle = (index * anglePerSegment) - 90;
        const radian = angle * (Math.PI / 180);
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        seg.style.transform = `translate(${x}px, ${y}px)`;

        const img = document.createElement('img');
        img.src = `./assets/aliens/${alienNum}.png`;
        img.classList.add('alien-icon');
        if (index === currentAlienIndex) img.classList.add('selected');
        if (isFavorited(alienNum)) img.classList.add('favorited');

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isActive && index === currentAlienIndex) {
                triggerTransform();
            } else if (isActive) {
                let steps = currentAlienIndex - index;
                rotateRing(steps);
            }
        });

        // double tap for the tea on this alien
        img.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (isActive) openInfoPanel(alienNum);
        });

        seg.appendChild(img);
        holoRing.appendChild(seg);
    });
}
buildRing();

// flash div - the screen goes white like you just looked at the sun
const flashDiv = document.createElement('div');
flashDiv.classList.add('transform-flash');
document.body.appendChild(flashDiv);

// update highlights
function updateHighlights() {
    const icons = holoRing.querySelectorAll('.alien-icon');
    icons.forEach((icon, i) => {
        icon.classList.toggle('selected', i === currentAlienIndex);
        icon.classList.toggle('favorited', isFavorited(alienSubset[i]));
    });
}

// rotate the ring - spin that wheel like its a game show
function rotateRing(steps) {
    if (!isActive) return; // cant scroll if the watch aint on bro
    if (window.Omnitrix?.isCoolingDown && window.Omnitrix.isCoolingDown()) return; // chill its recharging
    playSound('cycle');
    resetInactivityTimer();
    triggerScanLine();

    const prevSrc = alienDisplay.src;

    currentAlienIndex -= steps;

    if (currentAlienIndex < 0) {
        currentAlienIndex = (currentAlienIndex % displayCount + displayCount) % displayCount;
    } else if (currentAlienIndex >= displayCount) {
        currentAlienIndex = currentAlienIndex % displayCount;
    }

    ringRotation += (steps * anglePerSegment);

    const segments = holoRing.querySelectorAll('.holo-segment');
    const radius = 285;
    segments.forEach((seg, index) => {
        const angle = (index * anglePerSegment) - 90;
        const radian = angle * (Math.PI / 180);
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        seg.style.transform = `translate(${x}px, ${y}px) rotate(${-ringRotation}deg)`;
    });

    holoRing.style.transform = `scale(1) rotate(${ringRotation}deg)`;
    updateHighlights();
    alienDisplay.src = `./assets/aliens/${alienSubset[currentAlienIndex]}.png`;
    updateFavBtn();
    window.dispatchEvent(new CustomEvent('omnitrix-cycle', { detail: { prevSrc } }));
}

// transform - ITS HERO TIME
function triggerTransform() {
    if (window.Omnitrix?.isCoolingDown && window.Omnitrix.isCoolingDown()) return;
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
        holoRing.style.opacity = '0';
        holoRing.style.transform = `scale(0.5) rotate(${ringRotation}deg)`;
        window.dispatchEvent(new CustomEvent('omnitrix-transform'));
    }, 1200);
}

// screen click - slap that bad boy to turn it on
anel.addEventListener('click', () => {
    isActive = !isActive;
    if (isActive) {
        const beforeEvent = new CustomEvent('omnitrix-before-activate', { cancelable: true });
        window.dispatchEvent(beforeEvent);
        if (beforeEvent.defaultPrevented) {
            isActive = false;
            return;
        }
        playSound('cycle');
        anel.classList.add('active');
        alienDisplay.src = `./assets/aliens/${alienSubset[currentAlienIndex]}.png`;
        updateFavBtn();
        particlesContainer.classList.add('active');

        holoRing.style.opacity = '1';
        holoRing.style.transform = `scale(1) rotate(${ringRotation}deg)`;
        resetInactivityTimer();
        window.dispatchEvent(new CustomEvent('omnitrix-activate'));
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

// mouse wheel - scroll to pick your fighter
window.addEventListener('wheel', (e) => {
    if (!isActive) return;
    rotateRing(e.deltaY < 0 ? 1 : -1);
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
            if (infoPanel.classList.contains('visible')) {
                closeInfoPanel();
            } else if (isActive) {
                powerDown();
            }
            break;
    }
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

// sound toggle
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? 'â™ª' : 'â™ªÌ¶';
});

// random alien - feeling lucky punk?
randomBtn.addEventListener('click', () => {
    if (!isActive) anel.click(); // wake up first then we talk

    // Pick a random index different from current
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * displayCount);
    } while (randomIndex === currentAlienIndex && displayCount > 1);

    const steps = currentAlienIndex - randomIndex;
    // rapid spin animation cause we love the drama
    let totalSteps = Math.abs(steps) + displayCount; // extra full spin for the theatrics
    let direction = steps >= 0 ? 1 : -1;
    let i = 0;
    const spinInterval = setInterval(() => {
        rotateRing(direction);
        i++;
        if (i >= totalSteps) {
            clearInterval(spinInterval);
        }
    }, 100);
});

// theme toggle - go full villain arc with albedo red
themeToggle.addEventListener('click', () => {
    isAlbedo = !isAlbedo;
    document.body.classList.toggle('albedo', isAlbedo);
    themeIcon.textContent = isAlbedo ? 'A' : 'B';
    // gotta match the vibe with new particle colors
    createParticles();
});

// favorites button
favBtn.addEventListener('click', () => {
    if (!isActive) return;
    toggleFavorite(alienSubset[currentAlienIndex]);
});

// info panel - the alien's linkedin basically
function openInfoPanel(alienNum) {
    infoAlienImg.src = `./assets/aliens/${alienNum}.png`;
    infoAlienName.textContent = `Alien #${alienNum}`;
    infoAlienDesc.textContent = 'Omnitrix database entry.';
    infoFavIndicator.textContent = isFavorited(alienNum) ? 'Favorited' : '';
    infoPanel.classList.add('visible');
}

function closeInfoPanel() {
    infoPanel.classList.remove('visible');
}

infoClose.addEventListener('click', closeInfoPanel);

infoPanel.addEventListener('click', (e) => {
    if (e.target === infoPanel) closeInfoPanel();
});

// expose global omnitrix api - the public api that runs this whole universe
window.Omnitrix = {
    get isActive() { return isActive; },
    set isActive(v) { isActive = v; },
    get isAlbedo() { return isAlbedo; },
    get soundEnabled() { return soundEnabled; },
    set soundEnabled(v) { soundEnabled = v; },
    get currentAlienIndex() { return currentAlienIndex; },
    get alienSubset() { return alienSubset; },
    set alienSubset(v) { alienSubset = v; },
    get displayCount() { return displayCount; },
    get totalAliens() { return totalAliens; },
    get ringRotation() { return ringRotation; },
    set ringRotation(v) { ringRotation = v; },
    set currentAlienIndex(v) { currentAlienIndex = v; },
    el: { anel, holoRing, alienDisplay, scanLine, particlesContainer, flashDiv: null },
    playSound,
    rotateRing,
    triggerTransform,
    buildRing,
    updateHighlights,
    updateFavBtn,
    powerDown,
    resetInactivityTimer,
    createParticles,
    triggerScanLine,
    isFavorited,
    toggleFavorite,
    openInfoPanel,
    closeInfoPanel
};

window.Omnitrix.el.flashDiv = flashDiv;
