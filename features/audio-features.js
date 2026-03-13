// audio features - making this thing sound like it actually came from space
(function () {
    const O = window.Omnitrix;

    // web audio api goes brrrr
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    // background hum - that low key ominous sound that hits in the feels
    let humOsc = null;
    let humGain = null;
    let humActive = false;

    function startHum() {
        if (humActive || !O.soundEnabled) return;
        const ctx = getAudioCtx();
        humOsc = ctx.createOscillator();
        humGain = ctx.createGain();

        humOsc.type = 'sine'; // sine wave supremacy
        humOsc.frequency.setValueAtTime(80, ctx.currentTime); // 80hz, basically a cat purring
        humGain.gain.setValueAtTime(0, ctx.currentTime);
        humGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5); // fade in so it dont jumpscare you

        humOsc.connect(humGain);
        humGain.connect(ctx.destination);
        humOsc.start();
        humActive = true;
    }

    function stopHum() {
        if (!humActive || !humGain || !humOsc) return;
        const ctx = getAudioCtx();
        humGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        setTimeout(() => {
            try { humOsc.stop(); } catch (e) { }
            humActive = false;
            humOsc = null;
            humGain = null;
        }, 400);
    }


    // activation sound - the rising tone that gives you chills every time
    function playActivateSound() {
        if (!O.soundEnabled) return;
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }


    // power-down sound - the sad descending womp womp
    function playPowerDownSound() {
        if (!O.soundEnabled) return;
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    // hooking into events like a main character entering a scene
    window.addEventListener('omnitrix-activate', () => {
        playActivateSound();
        startHum();
    });

    window.addEventListener('omnitrix-powerdown', () => {
        playPowerDownSound();
        stopHum();
    });

    window.addEventListener('omnitrix-transform', () => {
        stopHum();
    });

    // stop the hum if someone hits mute cause we respect boundaries
    const origSoundToggle = document.getElementById('sound-toggle');
    if (origSoundToggle) {
        origSoundToggle.addEventListener('click', () => {
            if (!O.soundEnabled) {
                stopHum();
            } else if (O.isActive) {
                startHum();
            }
        });
    }
})();
