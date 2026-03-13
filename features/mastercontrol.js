// master control - unlocking the god mode
(function () {
    const O = window.Omnitrix;

    // the sneaky little panel they dont want you to know about
    const mcPanel = document.createElement('div');
    mcPanel.className = 'master-control-panel';
    mcPanel.innerHTML = `
        <button class="info-close" id="mc-close">X</button>
        <h3>Master Control</h3>
        <p>Enter override code:</p>
        <div class="mc-inputs">
            <input type="password" id="mc-code" maxlength="4" placeholder="****" />
            <button id="mc-submit">Unlock</button>
        </div>
        <p id="mc-status" class="mc-status"></p>
        <div class="mc-progress">
            <h4>Alien Unlock Progress: <span id="mc-count">0</span>/${O.totalAliens}</h4>
            <div class="mc-bar"><div class="mc-bar-fill" id="mc-bar-fill"></div></div>
        </div>
    `;
    document.body.appendChild(mcPanel);

    const mcCode = document.getElementById('mc-code');
    const mcSubmit = document.getElementById('mc-submit');
    const mcStatus = document.getElementById('mc-status');
    const mcClose = document.getElementById('mc-close');
    const mcCount = document.getElementById('mc-count');
    const mcBarFill = document.getElementById('mc-bar-fill');

    // the secret code is literally 1010 im not very creative
    const SECRET_CODE = "1010";

    // saving progress cause were not monsters who wipe saves
    let unlockedAliens = JSON.parse(localStorage.getItem('omnitrix-unlocked') || '[]');
    if (unlockedAliens.length === 0) {
        for (let i = 1; i <= 12; i++) unlockedAliens.push(i); // start with original 10 + 2 extras
        saveUnlocked();
    }

    // flag so other scripts know were in god mode
    O._masterControl = false;

    function saveUnlocked() {
        localStorage.setItem('omnitrix-unlocked', JSON.stringify(unlockedAliens));
        updateProgressUI();
    }

    function updateProgressUI() {
        mcCount.textContent = unlockedAliens.length;
        mcBarFill.style.width = `${(unlockedAliens.length / O.totalAliens) * 100}%`;
    }
    updateProgressUI();

    mcSubmit.addEventListener('click', () => {
        if (mcCode.value === SECRET_CODE) {
            mcStatus.textContent = "! MASTER CONTROL OVERRIDE ACCEPTED !";
            mcStatus.style.color = "#1cd947";
            if (O.isAlbedo) mcStatus.style.color = "#d91c1c";

            O._masterControl = true;
            
            // unlock everything like a true cheater
            const allAliens = [];
            for (let i = 1; i <= O.totalAliens; i++) allAliens.push(i);
            unlockedAliens = allAliens;
            saveUnlocked();

            O.alienSubset = [...allAliens];
            O.currentAlienIndex = 0;
            O.ringRotation = 0;
            O.buildRing();
            if (O.isActive) {
                O.el.alienDisplay.src = `./assets/aliens/${O.alienSubset[0]}.png`;
                O.el.holoRing.style.transform = `scale(1) rotate(0deg)`;
            }

            // fire the global event so pagination knows to wake up
            window.dispatchEvent(new CustomEvent('omnitrix-page-change'));

            setTimeout(() => {
                mcPanel.classList.remove('visible');
                mcStatus.textContent = "";
                mcCode.value = "";
            }, 2000);
        } else {
            mcStatus.textContent = "ACCESS DENIED.";
            mcStatus.style.color = "#ff3333";
            setTimeout(() => { mcStatus.textContent = ""; mcCode.value = ""; }, 1500);
        }
    });

    mcClose.addEventListener('click', () => mcPanel.classList.remove('visible'));

    // secret keyboard shortcut (Ctrl + Shift + M) to open it
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
            mcPanel.classList.toggle('visible');
            if (mcPanel.classList.contains('visible')) {
                mcCode.focus();
            }
        }
    });

    // passive unlock system - play with it and get rewarded
    let transCount = parseInt(localStorage.getItem('omnitrix-transcount') || '0');

    window.addEventListener('omnitrix-transform', () => {
        if (O._masterControl) return; // already unlocked everything bro why u grinding
        transCount++;
        localStorage.setItem('omnitrix-transcount', transCount);

        // every 3 transforms unlocks a new alien
        if (transCount % 3 === 0 && unlockedAliens.length < O.totalAliens) {
            let nextUnlock = unlockedAliens.length + 1;
            while (unlockedAliens.includes(nextUnlock) && nextUnlock <= O.totalAliens) {
                nextUnlock++;
            }
            if (nextUnlock <= O.totalAliens) {
                unlockedAliens.push(nextUnlock);
                saveUnlocked();
                
                // little toast notification
                const toast = document.createElement('div');
                toast.className = 'unlock-toast';
                toast.innerHTML = `<img src="./assets/aliens/${nextUnlock}.png"><span>New Alien Unlocked!</span>`;
                document.body.appendChild(toast);
                
                // force reflow
                void toast.offsetWidth;
                toast.classList.add('visible');
                
                setTimeout(() => {
                    toast.classList.remove('visible');
                    setTimeout(() => toast.remove(), 500);
                }, 3000);
            }
        }
    });
})();
