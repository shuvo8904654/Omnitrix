# Ben 10 Omniverse Omnitrix (Vanilla HTML/CSS/JS)

A fully functional, browser-based recreation of the Ben 10 Omniverse Omnitrix, built entirely from scratch without frameworks, using raw HTML, CSS, and JavaScript. I built this project to challenge myself with complex CSS animations, 3D perspective manipulation, Web Audio implementation, and state management using vanilla JS.

## Features

- **Interactive Holographic Ring:** A complete 3D animated alien selection ring with 86 different aliens to choose from.
- **Transformations:** Trigger transformations just like the cartoon, complete with a blinding flash, DNA scan lines, and sound effects.
- **Audio System:** Fully immersive audio using the Web Audio API with ominous background humming, selection clicks, and transformation effects.
- **Playlists System:** Curate your own custom squads of aliens, just like Ben curates his favorites! Save, load, and switch playlists seamlessly.
- **Albedo Theme:** Toggle between Ben's classic green hero theme and Albedo's red villain appearance.
- **Master Control:** A hidden feature (try pressing `Ctrl + Shift + M` and guessing the override code) to unlock the entire Omnitrix database without cooldowns.
- **Cooldowns & Timers:** Built-in cool-down period between transformations to keep it realistic to the show rules.
- **Visual Effects:** Glitch aesthetics, dynamic light bursts, and 3D tilt perspective driven by mouse movement.

## Setup & Running Locally

Since this is purely Vanilla code, you don't need any complex build tools. 

1. Clone the repository.
2. Open `index.html` in your favorite modern browser.
3. Enjoy! (Best experienced on Desktop in Fullscreen `🖵`).

> **Note:** For certain local files like Audio and Images to load properly due to browser security restrictions around localStorage and Cross-Origin Resource Sharing, you might want to serve it over a local server like `Live Server` or Python's `http.server`.

## Controls

- `Click / Tap`: Toggle the Omnitrix On and Off.
- `Mouse Wheel / Arrow Keys / Swipe`: Cycle through the alien ring.
- `Space / Enter`: Transform!
- `Esc`: Power down the watch.
- `P`: Open Playlist management window.

## Built With
- **HTML5:** Semantic architecture.
- **CSS3:** Heavy use of modern spec, including `clip-path` for the rugged alien armor shape, custom properties, and `@keyframes` for boot-up sequences. No SVGs, pure CSS!
- **Vanilla JavaScript:** Event-driven architecture utilizing `localStorage` to save your favorites and playlists globally! Web Audio API for interactive synthesized sound. 

---
*It's Hero Time!*
