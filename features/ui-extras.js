// ui extras - the cherry on top of this coding sundae
(function () {
    const O = window.Omnitrix;

    // pagination - because rendering 80+ icons at once nukes the browser fps
    // we inject the UI for it if it doesnt exist
    let pageContainer = document.getElementById('pagination-container');
    if (!pageContainer) {
        pageContainer = document.createElement('div');
        pageContainer.className = 'pagination-container';
        pageContainer.id = 'pagination-container';
        pageContainer.innerHTML = `<span class="page-counter" id="page-counter">Page 1</span>`;
        document.body.appendChild(pageContainer);
    }

    const pageCounter = document.getElementById('page-counter');
    let totalPages = 1;
    let currentPage = 1;

    function updatePaginationUI() {
        const activeCount = O.alienSubset.length;
        totalPages = Math.ceil(activeCount / O.displayCount) || 1;
        currentPage = Math.floor(O.currentAlienIndex / O.displayCount) + 1;
        
        if (totalPages > 1 && O.isActive) {
            pageContainer.classList.add('visible');
            pageCounter.textContent = `Page ${currentPage} of ${totalPages}`;
        } else {
            pageContainer.classList.remove('visible');
        }
    }

    // listen for the wheel to spin or a new playlist to load
    window.addEventListener('omnitrix-cycle', updatePaginationUI);
    window.addEventListener('omnitrix-activate', updatePaginationUI);
    window.addEventListener('omnitrix-powerdown', () => pageContainer.classList.remove('visible'));
    window.addEventListener('omnitrix-page-change', updatePaginationUI);


    // extra buttons container
    const uiControls = document.querySelector('.ui-controls');
    
    // fullscreen toggle - for that immersive 10 year old pretending to be ben tennyson experience
    const fsBtn = document.createElement('button');
    fsBtn.className = 'ui-btn';
    fsBtn.title = "Toggle Fullscreen";
    fsBtn.innerHTML = "ðŸ–µ";
    
    fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.log(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // bg toggle - sometimes you just want a plain background
    const bgBtn = document.createElement('button');
    bgBtn.className = 'ui-btn';
    bgBtn.title = "Toggle Background Effect";
    bgBtn.innerHTML = "ðŸŒŒ";
    
    let effectActive = true;
    bgBtn.addEventListener('click', () => {
        effectActive = !effectActive;
        const pContainer = O.el.particlesContainer;
        if (effectActive) {
            bgBtn.style.opacity = '1';
            if (O.isActive) pContainer.classList.add('active');
        } else {
            bgBtn.style.opacity = '0.5';
            pContainer.classList.remove('active');
        }
    });

    // share button - let the world know about your fire playlist
    const shareBtn = document.createElement('button');
    shareBtn.className = 'ui-btn';
    shareBtn.title = "Share Omnitrix";
    shareBtn.innerHTML = "âž¦";
    
    shareBtn.addEventListener('click', () => {
        const textArea = document.createElement("textarea");
        textArea.value = "Check out my Ben 10 Omnitrix! Built with raw CSS and JS.";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const orig = shareBtn.innerHTML;
            shareBtn.innerHTML = "âœ“";
            setTimeout(() => shareBtn.innerHTML = orig, 1500);
        } catch (err) {
            console.error('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    });

    // append em to the stack
    if (uiControls) {
        uiControls.appendChild(fsBtn);
        uiControls.appendChild(bgBtn);
        uiControls.appendChild(shareBtn);
    }

    // keyboard shortcuts overlay - press ? to see the map
    const helpOverlay = document.createElement('div');
    helpOverlay.className = 'help-overlay';
    helpOverlay.innerHTML = `
        <div class="help-box">
            <h3>Controls</h3>
            <ul>
                <li><span>Space/Enter</span> Transform / Activate</li>
                <li><span>Arrows/Wheel</span> Cycle Aliens</li>
                <li><span>Esc</span> Power Down / Close UI</li>
                <li><span>P</span> Open Playlists</li>
                <li><span>Shift+M+Ctrl</span> Master Control</li>
                <li><span>?</span> Toggle this help menu</li>
            </ul>
        </div>
    `;
    document.body.appendChild(helpOverlay);

    window.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            helpOverlay.classList.toggle('visible');
        }
        else if (e.key.toLowerCase() === 'p') {
            const playlistBtn = document.getElementById('playlist-btn');
            if (playlistBtn) playlistBtn.click();
        }
    });

    helpOverlay.addEventListener('click', () => helpOverlay.classList.remove('visible'));

})();
