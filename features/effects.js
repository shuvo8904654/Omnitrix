
// visual effects - making things look bussin
(function () {
    const O = window.Omnitrix;
    const screen = O.el.anel;
    const omnitrixEl = document.querySelector('.omnitrix');

    // glitch effect - gives it that broken tv aesthetic we all love
    const glitchLine = document.createElement('div');
    glitchLine.classList.add('glitch-line');
    screen.appendChild(glitchLine);

    const originalRotateRing = O.rotateRing;
    window.addEventListener('omnitrix-cycle', () => {
        screen.classList.remove('glitch');
        void screen.offsetWidth;
        screen.classList.add('glitch');
        setTimeout(() => screen.classList.remove('glitch'), 300);
    });

    // light burst - that glow up when you activate hits different
    const burstEl = document.getElementById('light-burst');
    const raysEl = document.getElementById('light-rays');

    // spawning light rays like its a jjk domain expansion
    if (raysEl) {
        const rayCount = 12;
        for (let i = 0; i < rayCount; i++) {
            const ray = document.createElement('div');
            ray.classList.add('light-ray');
            ray.style.transform = `rotate(${i * (360 / rayCount)}deg)`;
            raysEl.appendChild(ray);
        }
    }

    window.addEventListener('omnitrix-activate', () => {
        if (burstEl) {
            burstEl.classList.remove('active');
            void burstEl.offsetWidth;
            burstEl.classList.add('active');
            setTimeout(() => burstEl.classList.remove('active'), 800);
        }
        if (raysEl) {
            raysEl.classList.remove('active');
            void raysEl.offsetWidth;
            raysEl.classList.add('active');
            setTimeout(() => raysEl.classList.remove('active'), 1500);
        }
    });

    // alien crossfade - smooth transitions or we riot
    const prevDisplay = document.getElementById('alien-display-prev');

    window.addEventListener('omnitrix-cycle', (e) => {
        if (!prevDisplay) return;
        const prevSrc = e.detail?.prevSrc;
        if (prevSrc) {
            prevDisplay.src = prevSrc;
            prevDisplay.style.opacity = '1';
            setTimeout(() => {
                prevDisplay.style.opacity = '0';
            }, 50);
        }
    });

    // 3d tilt effect - move your mouse and watch the magic happen
    let tiltEnabled = true;

    window.addEventListener('mousemove', (e) => {
        if (!tiltEnabled) return;

        const rect = omnitrixEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        // clamp so it doesnt go crazy and yeet itself off screen
        const tiltX = Math.max(-1, Math.min(1, deltaY)) * -5; // pitch
        const tiltY = Math.max(-1, Math.min(1, deltaX)) * 5;  // yaw

        const baseScale = window.innerWidth <= 480 ? 0.6 : window.innerWidth <= 768 ? 0.85 : 1.1;
        omnitrixEl.style.transform = `scale(${baseScale}) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    window.addEventListener('mouseleave', () => {
        const baseScale = window.innerWidth <= 480 ? 0.6 : window.innerWidth <= 768 ? 0.85 : 1.1;
        omnitrixEl.style.transform = `scale(${baseScale})`;
    });
})();
