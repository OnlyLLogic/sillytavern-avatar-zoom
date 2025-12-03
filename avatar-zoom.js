// SillyTavern Avatar Zoom & Pan Extension
// Place this file in: /public/scripts/extensions/avatar-zoom.js
// Then enable it in SillyTavern settings.

(function() {
    console.log("Avatar Zoom Extension Loaded");

    let img;
    let scale = 1;
    let posX = 0, posY = 0;
    let startX = 0, startY = 0;
    let lastDist = 0;
    let isPanning = false;

    function init() {
        // Wait for the fullscreen avatar element
        const observer = new MutationObserver(() => {
            const el = document.querySelector('.fullscreen-avatar img');
            if (el) {
                img = el;
                setupGestureControls();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupGestureControls() {
        img.style.transformOrigin = "center center";
        img.style.touchAction = "none";

        img.addEventListener('touchstart', handleStart, { passive: false });
        img.addEventListener('touchmove', handleMove, { passive: false });
        img.addEventListener('touchend', handleEnd);
    }

    function handleStart(e) {
        if (e.touches.length === 1) {
            // Start panning
            isPanning = true;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
        } else if (e.touches.length === 2) {
            // Start zooming
            isPanning = false;
            lastDist = getDistance(e.touches);
        }
    }

    function handleMove(e) {
        e.preventDefault();

        if (e.touches.length === 1 && isPanning) {
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
        }

        if (e.touches.length === 2) {
            let newDist = getDistance(e.touches);
            let delta = newDist - lastDist;
            scale += delta * 0.005;
            scale = Math.max(0.5, Math.min(scale, 5));
            lastDist = newDist;
        }

        updateTransform();
    }

    function handleEnd() {
        isPanning = false;
    }

    function getDistance(touches) {
        let dx = touches[0].clientX - touches[1].clientX;
        let dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function updateTransform() {
        img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    init();
})();
 
