// playlist system - curate your own alien squad like a spotify playlist
(function () {
    const O = window.Omnitrix;
    const panel = document.getElementById('playlist-panel');
    const listContainer = document.getElementById('playlist-list');
    const playlistBtn = document.getElementById('playlist-btn');
    const playlistClose = document.getElementById('playlist-close');

    // pulling saved playlists from localstorage like old text messages
    let playlists = JSON.parse(localStorage.getItem('omnitrix-playlists') || '[]');
    let activePlaylistIndex = -1; // -1 means default aka the normie mode

    function savePlaylists() {
        localStorage.setItem('omnitrix-playlists', JSON.stringify(playlists));
    }

    function renderPlaylistList() {
        listContainer.innerHTML = ''; // nuke it and rebuild, the dom way

        // default option for the no playlist people
        const defItem = document.createElement('div');
        defItem.classList.add('playlist-item');
        if (activePlaylistIndex === -1) defItem.classList.add('active-playlist');
        defItem.textContent = 'Default (All Aliens)';
        defItem.addEventListener('click', () => {
            activePlaylistIndex = -1;
            loadDefaultAliens();
            renderPlaylistList();
        });
        listContainer.appendChild(defItem);

        playlists.forEach((pl, idx) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            if (idx === activePlaylistIndex) item.classList.add('active-playlist');

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${pl.name} (${pl.aliens.length})`;
            item.appendChild(nameSpan);

            const delBtn = document.createElement('button');
            delBtn.classList.add('pl-delete');
            delBtn.textContent = 'X';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playlists.splice(idx, 1);
                if (activePlaylistIndex === idx) {
                    activePlaylistIndex = -1;
                    loadDefaultAliens();
                } else if (activePlaylistIndex > idx) {
                    activePlaylistIndex--;
                }
                savePlaylists();
                renderPlaylistList();
            });
            item.appendChild(delBtn);

            item.addEventListener('click', () => {
                activePlaylistIndex = idx;
                loadPlaylist(pl);
                renderPlaylistList();
            });

            listContainer.appendChild(item);
        });
    }

    function loadPlaylist(pl) {
        O.alienSubset = [...pl.aliens];
        O.currentAlienIndex = 0;
        O.ringRotation = 0;
        O.buildRing();
        if (O.isActive) {
            O.el.alienDisplay.src = `./assets/aliens/${O.alienSubset[0]}.png`;
            O.updateFavBtn();
            O.el.holoRing.style.transform = `scale(1) rotate(0deg)`;
        }
        window.dispatchEvent(new CustomEvent('omnitrix-page-change'));
    }

    function loadDefaultAliens() {
        const subset = [];
        for (let i = 1; i <= O.displayCount; i++) subset.push(i);
        O.alienSubset = subset;
        O.currentAlienIndex = 0;
        O.ringRotation = 0;
        O.buildRing();
        if (O.isActive) {
            O.el.alienDisplay.src = `./assets/aliens/${O.alienSubset[0]}.png`;
            O.updateFavBtn();
            O.el.holoRing.style.transform = `scale(1) rotate(0deg)`;
        }
        window.dispatchEvent(new CustomEvent('omnitrix-page-change'));
    }

    function createNewPlaylist() {
        // snapshot whatever aliens are on the ring rn
        const currentAliens = [...O.alienSubset];
        const name = `Playlist ${playlists.length + 1}`;
        playlists.push({ name, aliens: currentAliens.slice(0, 12) });
        savePlaylists();
        renderPlaylistList();
    }

    function createFromFavorites() {
        const favs = JSON.parse(localStorage.getItem('omnitrix-favorites') || '[]');
        if (favs.length === 0) return; // cant make a playlist from nothing bestie
        const name = `Favorites Set`;
        playlists.push({ name, aliens: favs.slice(0, 12) });
        savePlaylists();
        renderPlaylistList();
    }

    // UI
    if (playlistBtn) {
        playlistBtn.addEventListener('click', () => {
            const isVisible = panel.classList.contains('visible');
            panel.classList.toggle('visible', !isVisible);
            if (!isVisible) renderPlaylistList();
        });
    }

    if (playlistClose) {
        playlistClose.addEventListener('click', () => {
            panel.classList.remove('visible');
        });
    }

    // Action buttons inside the panel
    const createBtn = document.getElementById('playlist-create');
    const createFavBtn = document.getElementById('playlist-create-fav');

    if (createBtn) {
        createBtn.addEventListener('click', createNewPlaylist);
    }
    if (createFavBtn) {
        createFavBtn.addEventListener('click', createFromFavorites);
    }

    // esc key = nope im out
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            e.stopPropagation();
        }
    });
})();
