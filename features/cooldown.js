// cooldown timer - no spamming allowed, touch grass for 5 seconds
(function () {
    const O = window.Omnitrix;

    // the recharge bar that tells you to be patient for once
    const cooldownContainer = document.getElementById('cooldown-bar-container');
    const cooldownBar = document.getElementById('cooldown-bar');
    const COOLDOWN_DURATION = 5000; // 5 whole seconds of waiting, the horror
    let isCoolingDown = false;
    let cooldownStart = 0;
    let cooldownRAF = null;

    function startCooldown() {
        if (window.Omnitrix._masterControl) return; // master control is built different, no cooldown needed
        isCoolingDown = true;
        cooldownStart = Date.now();
        cooldownContainer.classList.add('visible');
        cooldownBar.classList.remove('ready');
        cooldownBar.style.width = '100%';

        function tick() {
            const elapsed = Date.now() - cooldownStart;
            const remaining = Math.max(0, 1 - elapsed / COOLDOWN_DURATION);
            cooldownBar.style.width = `${remaining * 100}%`;

            if (remaining > 0) {
                cooldownRAF = requestAnimationFrame(tick);
            } else {
                isCoolingDown = false;
                cooldownBar.classList.add('ready');
                cooldownBar.style.width = '100%';
                setTimeout(() => {
                    cooldownContainer.classList.remove('visible');
                }, 800);
            }
        }
        cooldownRAF = requestAnimationFrame(tick);
    }

    // let other modules check if were still on timeout
    window.Omnitrix.isCoolingDown = () => isCoolingDown;

    // transformation timer - you got 10 seconds of alien time, make it count
    const timerEl = document.getElementById('transform-timer');
    const timerFill = document.getElementById('transform-timer-fill');
    const timerLabel = document.getElementById('transform-timer-label');
    const TRANSFORM_DURATION = 10000; // 10 secs just like the show fr
    let transformTimerRAF = null;
    let transformStart = 0;

    function startTransformTimer() {
        if (window.Omnitrix._masterControl) return;
        transformStart = Date.now();
        timerEl.classList.add('visible');
        timerFill.style.height = '100%';

        function tick() {
            const elapsed = Date.now() - transformStart;
            const remaining = Math.max(0, 1 - elapsed / TRANSFORM_DURATION);
            timerFill.style.height = `${remaining * 100}%`;

            const secsLeft = Math.ceil((TRANSFORM_DURATION - elapsed) / 1000);
            timerLabel.textContent = `${secsLeft}s`;

            if (remaining > 0) {
                transformTimerRAF = requestAnimationFrame(tick);
            } else {
                timerEl.classList.remove('visible');
                timerLabel.textContent = '';
                // transform wore off, now you gotta wait. skill issue tbh
                startCooldown();
            }
        }
        transformTimerRAF = requestAnimationFrame(tick);
    }

    // listening for that transform event like its hot gossip
    window.addEventListener('omnitrix-transform', () => {
        startTransformTimer();
    });

    
    window.addEventListener('omnitrix-before-activate', (e) => {
        if (isCoolingDown) {
            e.preventDefault();
            
            cooldownBar.style.background = '#ff6666';
            setTimeout(() => {
                cooldownBar.style.background = '';
            }, 200);
        }
    });

    // cleanup on powerdown - cant have timers running when the watch is off thats just wasteful
    window.addEventListener('omnitrix-powerdown', () => {
        cancelAnimationFrame(transformTimerRAF);
        timerEl.classList.remove('visible');
    });
})();
