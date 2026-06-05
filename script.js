const io = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                e.target.querySelectorAll(".bar-fill").forEach((b) => {
                    b.style.width = b.dataset.w + "%";
                });
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.classList.contains("about-prose") && !el.classList.contains("about-aside")) {
        el.style.transitionDelay = Math.floor(i % 3) * 0.09 + "s";
    }
    io.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {

    const navDock = document.querySelector(".kinetic-nav-dock");
    const trackWrapper = document.querySelector(".nav-links-track-wrapper");
    const liquidSlider = document.querySelector(".nav-liquid-slider");
    const dockLinks = document.querySelectorAll(".dock-link");

    // ==========================================
    // LIQUID SLIDER POSITION MANAGEMENT ENGINE
    // ==========================================
    function syncSliderToElement(element) {
        if (!element || !liquidSlider || !trackWrapper) return;

        const targetRect = element.getBoundingClientRect();
        const wrapperRect = trackWrapper.getBoundingClientRect();

        // Calculate coordinate offsets relative to track bounds container
        const leftPosition = targetRect.left - wrapperRect.left;

        liquidSlider.style.left = `${leftPosition}px`;
        liquidSlider.style.width = `${targetRect.width}px`;
    }

    // Set initial position on active module anchor block
    const activeInitialLink = document.querySelector(".dock-link.active");
    if (activeInitialLink) {
        // Wrap in timeout to guarantee calculations complete after layout paints
        setTimeout(() => syncSliderToElement(activeInitialLink), 100);
    }

    // Connect glide events to menu options hover states
    dockLinks.forEach(link => {
        link.addEventListener("mouseenter", () => syncSliderToElement(link));

        link.addEventListener("mouseleave", () => {
            const currentActiveLink = document.querySelector(".dock-link.active");
            if (currentActiveLink) syncSliderToElement(currentActiveLink);
        });

        link.addEventListener("click", function () {
            dockLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // ==========================================
    // PROXIMITY KINETIC DOCK DISTANCE ENGINE
    // ==========================================
    if (window.innerWidth > 768) { // Lock down parsing mechanics to desktop viewports only
        trackWrapper.addEventListener("mousemove", (e) => {
            dockLinks.forEach(link => {
                const rect = link.getBoundingClientRect();
                // Find horizontal item anchor midpoints coordinates
                const linkMidX = rect.left + rect.width / 2;

                // Absolute distance delta calculation
                const distanceX = Math.abs(e.clientX - linkMidX);
                const proximityThreshold = 120; // Range field limit pixel parameters

                if (distanceX < proximityThreshold) {
                    // Turn coordinate deltas into scaling multipliers using cosine curves
                    const scaleFactor = 1 + (0.12 * Math.cos((distanceX / proximityThreshold) * (Math.PI / 2)));
                    link.style.transform = `scale(${scaleFactor})`;
                } else {
                    link.style.transform = "scale(1)";
                }
            });
        });

        trackWrapper.addEventListener("mouseleave", () => {
            dockLinks.forEach(link => link.style.transform = "scale(1)");
        });
    }

    // ==========================================
    // ULTRA-SMOOTH HIDE-ON-SCROLL SUB-PIXEL MOTOR
    // ==========================================
    let precedingScrollPosition = window.scrollY;

    window.addEventListener("scroll", () => {
        const structuralCurrentScroll = window.scrollY;

        if (structuralCurrentScroll > precedingScrollPosition && structuralCurrentScroll > 150) {
            // Scrolling Downwards -> Stash the navigation capsule away
            navDock.classList.add("dock-hidden");
        } else {
            // Scrolling Upwards -> Return element array down onto perspective grid
            navDock.classList.remove("dock-hidden");
        }

        precedingScrollPosition = structuralCurrentScroll;
    }, { passive: true }); // Marks process event loops safe for asynchronous execution runs
});

// Dynamic stagger delays for About Me section elements
document.querySelectorAll(".about-prose p").forEach((p, idx) => {
    p.style.transitionDelay = (idx * 0.12) + "s";
});

document.querySelectorAll(".about-prose .pill").forEach((pill, idx) => {
    pill.style.transitionDelay = (0.36 + idx * 0.04) + "s";
});

document.querySelectorAll(".about-aside .info-row").forEach((row, idx) => {
    row.style.transitionDelay = (idx * 0.08) + "s";
});

window.addEventListener("scroll", () => {
    const wm = document.getElementById("wm");
    if (wm) wm.style.transform = "translateY(" + window.scrollY * 0.07 + "px)";
});


const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("a, .proj-row, .rc, .stat-cell").forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursor.style.width = "45px";
        cursor.style.height = "45px";
        cursor.style.background = "rgba(181,96,26,0.1)";
    });

    el.addEventListener("mouseleave", () => {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        cursor.style.background = "transparent";
    });
});

/* Smooth parallax micro movement */
window.addEventListener("scroll", () => {
    document.querySelectorAll(".proj-row, .rc").forEach((el, i) => {
        const speed = (window.scrollY * 0.02 * (i % 3 + 1));
        el.style.transform = `translateY(${speed * 0.02}px)`;
    });
});



// Loader

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("quantum-sky");
    const ctx = canvas.getContext("2d");
    const statusText = document.getElementById("status-text");
    const busFill = document.getElementById("loader-bus-fill");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = [];
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 200; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // Simulation of system load stages
    const stages = [
        { text: "CALIBRATING_MEMORY_BUS...", progress: 20 },
        { text: "INITIALIZING_KERNEL_THREADS...", progress: 45 },
        { text: "ASSEMBLING_RENDER_PIPELINE...", progress: 70 },
        { text: "BOOTING_SYSTEM_INTERFACE...", progress: 100 }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
        if (currentStage >= stages.length) {
            clearInterval(interval);
            setTimeout(hideLoader, 500);
            return;
        }
        const stage = stages[currentStage];
        statusText.textContent = stage.text;
        busFill.style.width = `${stage.progress}%`;
        currentStage++;
    }, 1200);

    function hideLoader() {
        const loader = document.getElementById("loader");
        loader.style.opacity = 0;
        setTimeout(() => loader.style.display = 'none', 1000);
    }
});

// Dynamic Bubble Generator
function initBubbles() {
    const container = document.querySelector(".bubbles-container");
    if (!container) return;

    const count = 15;
    for (let j = 0; j < count; j++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        // Randomize sizes (30px to 110px)
        const size = Math.random() * 80 + 30;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Randomize starting horizontal position
        bubble.style.left = `${Math.random() * 100}vw`;

        // Randomize timing (durations 18s to 36s, pre-staggered delays)
        bubble.style.animationDuration = `${Math.random() * 18 + 18}s`;
        bubble.style.animationDelay = `${Math.random() * -20}s`; // Negative delay starts bubbles immediately scattered

        // Randomize drift amount (horizontal movement during float)
        const drift = (Math.random() * 120) - 60; // -60px to 60px
        bubble.style.setProperty("--drift-x", `${drift}px`);

        // Randomize opacity (0.15 to 0.45)
        const maxOpacity = Math.random() * 0.3 + 0.15;
        bubble.style.setProperty("--max-opacity", maxOpacity);

        container.appendChild(bubble);
    }
}

window.addEventListener("DOMContentLoaded", initBubbles);


document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DATA TRACE VECTOR BACKDROP CANVAS ENGINE
    // ==========================================
    const canvas = document.getElementById("console-matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    window.addEventListener("resize", () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    });

    const columnsCount = Math.floor(w / 25);
    const traceDrops = Array(columnsCount).fill(0);

    function drawMatrixBackground() {
        ctx.fillStyle = "rgba(4, 6, 10, 0.15)";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "rgba(37, 99, 235, 0.12)"; // Faint Royal Blue binary data packages
        ctx.font = "9px monospace";

        for (let i = 0; i < traceDrops.length; i++) {
            const codeText = Math.random() > 0.5 ? "1" : "0";
            const xCoord = i * 25;
            const yCoord = traceDrops[i] * 25;

            ctx.fillText(codeText, xCoord, yCoord);

            if (yCoord > h && Math.random() > 0.975) {
                traceDrops[i] = 0;
            }
            traceDrops[i]++;
        }
    }
    setInterval(drawMatrixBackground, 50);

    // ==========================================
    // HARDWARE SYNC TERMINAL SCRAMBLE TEXT ENGINE
    // ==========================================
    const morphTextElement = document.getElementById("morph-text");
    const phrasesCollection = [
        "Embedded Intelligence",
        "Academic Excellence",
        "Research & Innovation",
        "System Architecture"
    ];

    class CharacterScrambler {
        constructor(element) {
            this.el = element;
            this.chars = "!<>-_\\/[]{}—=+*^?#________";
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const maxLen = Math.max(oldText.length, newText.length);
            this.queue = [];
            for (let i = 0; i < maxLen; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 25);
                const end = start + Math.floor(Math.random() * 25);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameId);
            this.frame = 0;
            this.update();
        }
        update() {
            let output = '';
            let completeCount = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    completeCount++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span style="color:#60a5fa">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (completeCount === this.queue.length) {
                this.resolve();
            } else {
                this.frameId = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }
    const scramblerNode = new CharacterScrambler(morphTextElement);

    // ==========================================
    // RUNTIME MEMORY DECK BUS MANAGEMENT ENGINE
    // ==========================================
    const tabButtons = document.querySelectorAll(".hw-tab-btn");
    const dataSlides = document.querySelectorAll(".console-data-slide");
    const progressFillBar = document.getElementById("deck-progress-bar");
    const playbackToggleBtn = document.getElementById("console-playback-toggle");
    const automationStatusDot = document.querySelector(".automation-status-dot");
    const automationLabel = document.getElementById("automation-label");

    let activeIndex = 0;
    let cycleTimer = null;
    let clockTicksAccumulated = 0;
    const maxTickThreshold = 5000; // 5-Second Interval Cycles
    const updateTickResolution = 30;
    let isAutoplayRunning = true;

    function transitionToSector(targetIndex) {
        activeIndex = targetIndex;
        clockTicksAccumulated = 0;

        // Sync Tab Buttons Active States
        tabButtons.forEach((btn, idx) => {
            btn.classList.toggle("active", idx === targetIndex);
        });

        // Sync Slide Content Blocks Active states
        dataSlides.forEach((slide, idx) => {
            slide.classList.toggle("active", idx === targetIndex);
        });

        // Trigger scramble translation on character array morph parameters
        scramblerNode.setText(phrasesCollection[targetIndex]);
    }

    function executeCoreClockTick() {
        if (!isAutoplayRunning) return;

        clockTicksAccumulated += updateTickResolution;
        const widthPercentage = (clockTicksAccumulated / maxTickThreshold) * 100;
        if (progressFillBar) progressFillBar.style.width = `${widthPercentage}%`;

        if (clockTicksAccumulated >= maxTickThreshold) {
            let nextIndex = (activeIndex + 1) % dataSlides.length;
            transitionToSector(nextIndex);
        }
    }

    function initCycleLoop() {
        cycleTimer = setInterval(executeCoreClockTick, updateTickResolution);
    }
    initCycleLoop();

    // Attach Event Listeners to Buttons Stack
    tabButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const destIndex = parseInt(this.getAttribute("data-slide"));
            transitionToSector(destIndex);

            // On direct user modification, temporarily halt loading animations
            if (progressFillBar) progressFillBar.style.width = "0%";
            clockTicksAccumulated = 0;
        });
    });

    // Handle Manual Playback Pause/Resume requests
    if (playbackToggleBtn) {
        playbackToggleBtn.addEventListener("click", () => {
            isAutoplayRunning = !isAutoplayRunning;

            if (isAutoplayRunning) {
                playbackToggleBtn.textContent = "PAUSE_BUS";
                automationStatusDot.classList.add("running");
                automationLabel.textContent = "STREAM_CYCLE_ACTIVE";
            } else {
                playbackToggleBtn.textContent = "RUN_BUS";
                automationStatusDot.classList.remove("running");
                automationLabel.textContent = "STREAM_CYCLE_HALTED";
                if (progressFillBar) progressFillBar.style.width = "0%";
            }
        });
    }
});
// Skills

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // TECHNICAL DATA DATABASE MATRIX
    // ==========================================
    const SKILLS_DATABASE = {
        "programming": ["Python", "C", "C++", "Java", "Kotlin", "PHP"],
        "ai-ml": ["TensorFlow", "TF Lite", "scikit-learn", "NLP", "Anomaly Detection", "Clustering"],
        "embedded-iot": ["Microcontrollers", "Real-time IoT", "Comm Protocols", "Circuit Design", "Prototyping", "Power Electronics"],
        "mobile-web": ["Android", "Java / Kotlin", "Flutter", "Flask", "Django"],
        "databases-cloud": ["MySQL", "Firebase", "Microsoft Azure", "AWS"],
        "security-crypto": ["Custom Hashing", "Encryption", "Password Security"]
    };

    const viewport = document.getElementById('skills-dynamic-viewport');
    const sectorButtons = document.querySelectorAll('.sector-node-btn');
    const logConsole = document.getElementById('terminal-stream-log');

    function pushSystemLog(message, isSuccess = false) {
        if (!logConsole) return;
        const line = document.createElement('p');
        line.className = `log-line ${isSuccess ? 'text-green' : ''}`;
        line.innerHTML = `&gt; ${message}`;
        logConsole.appendChild(line);
        if (logConsole.children.length > 4) logConsole.removeChild(logConsole.children[0]);
    }

    // ==========================================
    // THEMATIC GEOMETRY GENERATORS (OUT OF THE BOX)
    // ==========================================

    // 1. Structure Map: Hierarchical Binary Tree
    function computeTreePosition(index, total) {
        // Simple mapping structure indexes: 0=Root, 1=L1-Left, 2=L1-Right, 3=L2-Left-Left...
        let level = Math.floor(Math.log2(index + 1));
        let levelPositions = Math.pow(2, level);
        let positionInLevel = index - (levelPositions - 1);

        // Horizontal spacing steps calculated dynamically across center bounds
        let left = 50 + (positionInLevel - (levelPositions - 1) / 2) * (80 / levelPositions);
        let top = 15 + (level * 22); // Distribute downward vertically

        return { left: `${left}%`, top: `${top}%` };
    }

    // 2. Structure Map: Multi-Tier Database Silo / Cloud Column Stack
    function computeSiloPosition(index, total) {
        const itemsPerColumn = 3;
        let colIdx = index % 2; // Split across 2 columns side-by-side
        let rowIdx = Math.floor(index / 2);

        let left = colIdx === 0 ? 32 : 68; // Centered structured dual tracks
        let top = 20 + (rowIdx * 24);      // Safe vertical baseline shifts

        return { left: `${left}%`, top: `${top}%` };
    }

    // 3. Structure Map: Decentralized Core Neural Cluster Network
    function computeClusterPosition(index, total) {
        if (index === 0) return { left: "50%", top: "45%" }; // Central Anchor Node

        // Radial geometry distribution equations
        let angle = ((index - 1) / (total - 1)) * 2 * Math.PI;
        let radiusX = 32; // Safe aspect radius constraints
        let radiusY = 28;

        let left = 50 + radiusX * Math.cos(angle);
        let top = 45 + radiusY * Math.sin(angle);

        return { left: `${left}%`, top: `${top}%` };
    }

    // ==========================================
    // CORE MOTION GENERATOR PIPELINE
    // ==========================================
    function renderThematicNodes(sectorKey) {
        if (!viewport) return;

        // Remove active chips safely
        const existingNodes = viewport.querySelectorAll('.kinetic-node-chip');
        existingNodes.forEach(node => {
            node.style.opacity = '0';
            node.style.transform = 'scale(0.4) translate(-50%, -50%)';
            setTimeout(() => node.remove(), 400);
        });

        // Wipe previous geometric connection line arrays
        const oldLines = viewport.querySelectorAll('.matrix-vector-line');
        oldLines.forEach(line => line.remove());

        const targetSkills = SKILLS_DATABASE[sectorKey] || [];
        pushSystemLog(`COMPUTING_THEMATIC_LAYOUT: [${sectorKey.toUpperCase()}]`);

        setTimeout(() => {
            let positionsArray = [];

            // Step 1: Map layout positions dynamically matching key classifications
            targetSkills.forEach((skill, index) => {
                let coords;
                if (sectorKey === 'programming') {
                    coords = computeTreePosition(index, targetSkills.length);
                } else if (sectorKey === 'databases-cloud') {
                    coords = computeSiloPosition(index, targetSkills.length);
                } else {
                    coords = computeClusterPosition(index, targetSkills.length);
                }
                positionsArray.push(coords);

                // Step 2: Initialize structural text nodes
                const chip = document.createElement('div');
                chip.className = 'kinetic-node-chip active-layout-node';
                chip.textContent = skill;
                chip.style.opacity = '0';
                chip.style.left = coords.left;
                chip.style.top = coords.top;
                chip.style.transform = 'scale(0.5) translate(-50%, -50%)';
                chip.style.zIndex = 50 - index; // Prevents stacking sequence blocks

                viewport.appendChild(chip);

                // Staggered entrance transitions
                setTimeout(() => {
                    chip.style.opacity = '1';
                    chip.style.transform = 'scale(1) translate(-50%, -50%)';
                }, index * 50);

                // Hover Telemetry listeners
                chip.addEventListener('mouseenter', () => {
                    pushSystemLog(`DATA_NODE_FETCH: ${skill.toUpperCase()} // RESOLVED`, true);
                    chip.style.transform = 'scale(1.1) translate(-50%, -50%) translateZ(30px)';
                });

                chip.addEventListener('mouseleave', () => {
                    chip.style.transform = 'scale(1) translate(-50%, -50%) translateZ(0px)';
                });
            });

            // Step 3: Draw structural geometric connector links
            setTimeout(() => {
                if (sectorKey === 'programming') {
                    // Create Parent-Child links down the binary tracks
                    for (let i = 1; i < targetSkills.length; i++) {
                        let parentIdx = Math.floor((i - 1) / 2);
                        drawVectorLine(positionsArray[parentIdx], positionsArray[i]);
                    }
                } else if (sectorKey !== 'databases-cloud') {
                    // Mesh Link: Connect satellites back into central anchor hubs
                    for (let i = 1; i < targetSkills.length; i++) {
                        drawVectorLine(positionsArray[0], positionsArray[i]);
                    }
                }
            }, targetSkills.length * 50 + 200);

        }, 300);
    }

    // Mathematical calculations tracking lines mapping vectors dynamically
    function drawVectorLine(startCoord, endCoord) {
        const line = document.createElement('div');
        line.className = 'matrix-vector-line';
        viewport.appendChild(line);

        // Convert percentage metrics into clean float metrics
        let x1 = parseFloat(startCoord.left);
        let y1 = parseFloat(startCoord.top);
        let x2 = parseFloat(endCoord.left);
        let y2 = parseFloat(endCoord.top);

        let w = viewport.clientWidth;
        let h = viewport.clientHeight;

        let px1 = (x1 / 100) * w;
        let py1 = (y1 / 100) * h;
        let px2 = (x2 / 100) * w;
        let py2 = (y2 / 100) * h;

        let distance = Math.hypot(px2 - px1, py2 - py1);
        let angle = Math.atan2(py2 - py1, px2 - px1) * 180 / Math.PI;

        line.style.width = `${distance}px`;
        line.style.left = `${px1}px`;
        line.style.top = `${py1}px`;
        line.style.transform = `rotate(${angle}deg)`;

        // Trigger fluid drawing line fades securely
        setTimeout(() => { line.style.opacity = '0.15'; }, 50);
    }

    // ==========================================
    // TEXT TEXT-SCRAMBLE ENGINE REGISTRATION
    // ==========================================
    function decodeGlitchText(element) {
        const originalText = element.getAttribute('data-scramble');
        const glyphs = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789_@#$";
        let iterations = 0;

        const interval = setInterval(() => {
            element.textContent = originalText.split("")
                .map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                }).join("");

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    }

    sectorButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;
            sectorButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const targetSector = button.getAttribute('data-sector');
            decodeGlitchText(button.querySelector('.sector-title'));
            renderThematicNodes(targetSector);
        });
    });

    // Boot pipeline on load sequence execution
    renderThematicNodes("programming");
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.rc-interactive-card');
    const svgCanvas = document.getElementById('schematic-svg');
    const hudTicker = document.getElementById('hud-ticker');
    const nodeCountDisplay = document.getElementById('vector-count');

    // ==========================================
    // MULTI-AXIS PARALLAX & GLOW TRACK ENGINE
    // ==========================================
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse positions mapping inside bounds
            const y = e.clientY - rect.top;

            // Bind values directly into CSS Variables variables safely
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Compute 3D Rotational Tilting Vectors
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 4; // Caps max angle tilt at 4deg
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.style.transition = "transform 0.1s ease, background 0.3s, border-color 0.3s";

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ==========================================
    // VECTOR COMPOSITOR ENGINE (SVG PLOTTER)
    // ==========================================
    const BLUEPRINT_SCHEMATICS = {
        "gold-medal": {
            ticker: "DIAGNOSTIC::ACADEMIC_HALO_CORE_LOADED",
            color: "#facc15",
            nodes: 5,
            draw: () => {
                let markup = '';
                // Render Concentric Geometric Halos
                markup += `<circle cx="200" cy="200" r="80" class="vector-shape" stroke="#facc15" stroke-dasharray="5 5" opacity="0.3"/>`;
                markup += `<circle cx="200" cy="200" r="60" class="vector-shape" stroke="#facc15" style="animation-delay: 0.2s;"/>`;
                markup += `<circle cx="200" cy="200" r="30" class="vector-shape" stroke="#facc15" stroke-dasharray="10 5" style="animation-delay: 0.4s;"/>`;
                // Structural Crosshairs
                markup += `<line x1="200" y1="60" x2="200" y2="340" class="vector-shape" stroke="#facc15" opacity="0.2" style="animation-delay: 0.5s;"/>`;
                markup += `<line x1="60" y1="200" x2="340" y2="200" class="vector-shape" stroke="#facc15" opacity="0.2" style="animation-delay: 0.5s;"/>`;
                // Satellite Anchor Nodes
                const pts = [[200, 60], [200, 340], [60, 200], [340, 200], [200, 200]];
                pts.forEach((pt, i) => {
                    markup += `<circle cx="${pt[0]}" cy="${pt[1]}" r="4" class="vector-node-point" stroke="#facc15" style="animation-delay: ${0.6 + i * 0.1}s;"/>`;
                });
                return markup;
            }
        },
        "cosmic-hash": {
            ticker: "DIAGNOSTIC::CELESTIAL_ENTROPY_ORBIT_MODEL",
            color: "#34d399",
            nodes: 6,
            draw: () => {
                let markup = '';
                // Center Star Target Hub
                markup += `<circle cx="200" cy="200" r="15" class="vector-shape" stroke="#34d399"/>`;
                // Elliptical Orbital Trajectories
                markup += `<ellipse cx="200" cy="200" rx="120" ry="45" class="vector-shape" stroke="#34d399" transform="rotate(30 200 200)" opacity="0.4" style="animation-delay: 0.1s;"/>`;
                markup += `<ellipse cx="200" cy="200" rx="120" ry="45" class="vector-shape" stroke="#34d399" transform="rotate(-40 200 200)" opacity="0.4" style="animation-delay: 0.3s;"/>`;
                markup += `<circle cx="200" cy="200" r="100" class="vector-shape" stroke="#34d399" stroke-dasharray="6 8" opacity="0.2" style="animation-delay: 0.5s;"/>`;
                // Hash Vector Intersect Nodes
                const nodes = [[110, 150], [290, 250], [120, 260], [280, 140], [200, 200]];
                nodes.forEach((n, i) => {
                    markup += `<line x1="200" y1="200" x2="${n[0]}" y2="${n[1]}" class="vector-shape" stroke="#34d399" opacity="0.3" style="animation-delay: ${0.4 + i * 0.1}s;"/>`;
                    markup += `<circle cx="${n[0]}" cy="${n[1]}" r="4" class="vector-node-point" stroke="#34d399" style="animation-delay: ${0.8 + i * 0.08}s;"/>`;
                });
                return markup;
            }
        },
        "smart-grid": {
            ticker: "DIAGNOSTIC::GRID_LOAD_BALANCER_MESH",
            color: "#60a5fa",
            nodes: 8,
            draw: () => {
                let markup = '';
                // Render Array Node Interconnections
                const gridPoints = [[140, 120], [260, 120], [320, 200], [260, 280], [140, 280], [80, 200], [200, 160], [200, 240]];
                // Generate web pathways
                gridPoints.forEach((pt, i) => {
                    gridPoints.forEach((nextPt, j) => {
                        // Limit line density allocations to adjacent items
                        if (Math.hypot(pt[0] - nextPt[0], pt[1] - nextPt[1]) < 130) {
                            markup += `<line x1="${pt[0]}" y1="${pt[1]}" x2="${nextPt[0]}" y2="${nextPt[1]}" class="vector-shape" stroke="#60a5fa" opacity="0.15"/>`;
                        }
                    });
                });
                // Draw nodes on upper visibility bounds
                gridPoints.forEach((pt, i) => {
                    markup += `<circle cx="${pt[0]}" cy="${pt[1]}" r="4" class="vector-node-point" stroke="#60a5fa" style="animation-delay: ${i * 0.08}s;"/>`;
                });
                return markup;
            }
        },
        "railway-safety": {
            ticker: "DIAGNOSTIC::AUTOMATED_TRACK_ANOMALY_SCANNER",
            color: "#60a5fa",
            nodes: 7,
            draw: () => {
                let markup = '';
                // Draw Linear Rail Arrays
                markup += `<line x1="60" y1="140" x2="340" y2="140" class="vector-shape" stroke="#60a5fa" style="animation-delay: 0.1s;"/>`;
                markup += `<line x1="60" y1="260" x2="340" y2="260" class="vector-shape" stroke="#60a5fa" style="animation-delay: 0.2s;"/>`;
                // Track Ties (Ties cross-connect arrays)
                for (let x = 90; x <= 310; x += 30) {
                    markup += `<line x1="${x}" y1="140" x2="${x}" y2="260" class="vector-shape" stroke="#60a5fa" opacity="0.2" style="animation-delay: 0.3s;"/>`;
                }
                // Scanner Focal Target Vectors
                markup += `<circle cx="200" cy="140" r="8" class="vector-shape" stroke="#ef4444" style="animation-delay: 0.5s;"/>`;
                markup += `<line x1="200" y1="140" x2="260" y2="200" class="vector-shape" stroke="#ef4444" stroke-dasharray="3 3" style="animation-delay: 0.6s;"/>`;
                markup += `<circle cx="260" cy="200" r="5" class="vector-node-point" stroke="#ef4444" style="animation-delay: 0.7s;"/>`;
                return markup;
            }
        }
    };

    // ==========================================
    // STATE TRANSITION MANAGER CONTROLLER
    // ==========================================
    function loadBlueprint(id) {
        const blueprint = BLUEPRINT_SCHEMATICS[id];
        if (!blueprint) return;

        // Visual text telemetry sync updates
        hudTicker.textContent = blueprint.ticker;
        nodeCountDisplay.textContent = `NODES: 0${blueprint.nodes}`;

        // Inject computed template blocks inside target viewport canvas
        svgCanvas.innerHTML = blueprint.draw();
    }

    // Connect event interactions to target components
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('focused-node'));
            card.classList.add('focused-node');

            const projectID = card.getAttribute('data-project');
            loadBlueprint(projectID);
        });
    });

    // Run active pipeline initialization trigger elements on layout boot
    loadBlueprint("gold-medal");
    cards[0].classList.add('focused-node');
});

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // MILESTONE CONFIGURATION MATRIX
    // ==========================================
    const PROJECT_REGISTRY = {
        "wandergo": {
            ticker: "MODULE::WANDERGO.SYS",
            percentage: 150,
            statusLabel: "AWARD WINNING",
            statusColor: "#facc15", // Gold Surge
            track: "Intuitive Exploration Mapping",
            architecture: "Mobile Interactive Ecosystem",
            stack: ["Flutter", "Dart", "Mapbox API", "Node.js", "Express"]
        },
        "nisara": {
            ticker: "MODULE::NISARA_HEALTH.CORE",
            percentage: 100,
            statusLabel: "PUBLISHED",
            statusColor: "#34d399", // Solid Production Emerald
            track: "Smart Healthcare Logistics",
            architecture: "Clinical Prototype & Research Build",
            stack: ["Java", "Kotlin", "Firebase Realtime DB", "XML", "Android Architecture Components"]
        },
        "cortex": {
            ticker: "MODULE::CORTEX_COLLAR.MESH",
            percentage: 150,
            statusLabel: "AWARD WINNING",
            statusColor: "#facc15",
            track: "Agricultural Telemetry & Geofencing",
            architecture: "IoT Hardware Array & Backend",
            stack: ["Python", "C++", "Embedded IoT Systems", "MQTT Protocols", "Flask"]
        },
        "miners-aid": {
            ticker: "MODULE::MINERS_AID.SAFETY",
            percentage: 100,
            statusLabel: "COMPLETED",
            statusColor: "#34d399",
            track: "Underground Hazard Forecasting",
            architecture: "Predictive ML Analytics Pipeline",
            stack: ["Python", "TensorFlow Lite", "Scikit-Learn", "Core Hardware Interface"]
        },
        "challo": {
            ticker: "MODULE::CHALLO_ROUTING.NODE",
            percentage: 45,
            statusLabel: "IN DEVELOPMENT",
            statusColor: "#fbbf24", // Warning Orange/Amber
            track: "Campus Transit Optimization Networks",
            architecture: "Algorithmic Graph Architecture",
            stack: ["Python", "Django", "PostgreSQL", "Google Maps Engine API"]
        },
        "ampces": {
            ticker: "MODULE::AMPCES_V2.VISION",
            percentage: 25,
            statusLabel: "R&D PHASE",
            statusColor: "#f472b6", // Deep Research Fuchsia
            track: "Botanical Specimen Computer Vision",
            architecture: "Deep Learning Neural Classifier",
            stack: ["Python", "PyTorch", "OpenCV Image Pipeline", "Flask API"]
        }
    };

    const telemetryRows = document.querySelectorAll('.proj-telemetry-row');
    const tickerLabel = document.getElementById('project-ticker-id');
    const specTrack = document.getElementById('monitor-spec-track');
    const specDeploy = document.getElementById('monitor-spec-deploy');
    const techCloud = document.getElementById('monitor-tech-cloud');
    const metricRing = document.getElementById('monitor-metric-ring');
    const percentageLabel = document.getElementById('monitor-metric-percentage');
    const ringSubText = document.querySelector('.ring-sub-txt');

    // ==========================================
    // CORE COCKPIT DISPLAY MANAGER
    // ==========================================
    function updateCockpitMonitor(projectKey) {
        const data = PROJECT_REGISTRY[projectKey];
        if (!data) return;

        // 1. Telemetry Specification Fields Update
        tickerLabel.textContent = data.ticker;
        specTrack.textContent = data.track;
        specDeploy.textContent = data.architecture;
        ringSubText.textContent = data.statusLabel;
        ringSubText.style.color = data.statusColor;

        // 2. Render Tech Stack Chips Elements
        techCloud.innerHTML = '';
        data.stack.forEach(tech => {
            const chip = document.createElement('span');
            chip.className = 'monitor-stack-node';
            chip.textContent = tech;
            techCloud.appendChild(chip);
        });

        // 3. Mathematical Recalculation of SVG Gauges (Circumference 2 * PI * r)
        const radius = 50;
        const circumference = 2 * Math.PI * radius; // Approx 314.16

        // Dynamic handling for over-indexing milestones (like 150%)
        let displayPercentage = data.percentage;
        let strokePercentage = Math.min(displayPercentage, 100);

        if (displayPercentage > 100) {
            // For 150%, make the ring look completely locked full and trigger pulse class
            strokePercentage = 100;
            metricRing.classList.add('gauge-overdrive');
        } else {
            metricRing.classList.remove('gauge-overdrive');
        }

        const targetOffset = circumference - (strokePercentage / 100) * circumference;

        // Apply target calculations directly to element vector paths
        metricRing.style.strokeDashoffset = targetOffset;
        metricRing.style.stroke = data.statusColor;
        percentageLabel.textContent = `${displayPercentage}%`;
        percentageLabel.style.color = data.statusColor;
    }

    // ==========================================
    // PROCEDURAL GLITCH-TEXT SCRAMBLER
    // ==========================================
    function decodeGlitchHeading(element) {
        const originalText = element.getAttribute('data-scramble');
        const glyphs = "X01_Y79_Z84_MK_##_@";
        let iterations = 0;

        const interval = setInterval(() => {
            element.textContent = originalText.split("")
                .map((letter, index) => {
                    if (index < iterations) return originalText[index];
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                }).join("");

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 25);
    }

    // Register Layout MouseListeners
    telemetryRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            if (row.classList.contains('active')) return;

            telemetryRows.forEach(r => r.classList.remove('active'));
            row.classList.add('active');

            const projectID = row.getAttribute('data-project-id');
            const targetHeader = row.querySelector('.proj-row-name');

            decodeGlitchHeading(targetHeader);
            updateCockpitMonitor(projectID);
        });
    });

    // Boot pipeline on load sequence execution with Project 01
    updateCockpitMonitor("wandergo");
});

document.addEventListener("DOMContentLoaded", () => {

    // Select experience row containers
    const experienceRows = document.querySelectorAll('.exp-log-row');

    // Configure high-efficiency intersection monitors
    const experienceObserverOptions = {
        root: null, // Track targets relative directly to the browser window viewport
        rootMargin: "0px",
        threshold: 0.25 // Fires precisely when 15% of the element bounds clip into view
    };

    const experienceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Break loop execution safely if element hasn't reached visibility threshold
            if (!entry.isIntersecting) return;

            const targetedRow = entry.target;

            // Inject operational class to kick off hardware CSS transition chain
            targetedRow.classList.add('system-rendered');

            // Drop target tracker loop allocation immediately to conserve memory allocations
            observer.unobserve(targetedRow);
        });
    }, experienceObserverOptions);

    // Mount targets onto system tracking pipelines
    experienceRows.forEach(row => {
        experienceObserver.observe(row);
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const eduSection = document.getElementById('education');
    const cgpaCounter = document.getElementById('cgpa-counter');
    const hardwareCards = document.querySelectorAll('.hw-component-card');
    const tracePaths = document.querySelectorAll('.trace-path');

    let counterBooted = false;

    // ==========================================
    // OLED TELEMETRY CORER RUNTIME INCREMENTER
    // ==========================================
    function bootOledOdometer() {
        if (counterBooted || !cgpaCounter) return;
        counterBooted = true;

        const targetValue = parseFloat(cgpaCounter.getAttribute('data-target')); // 9.79
        let currentTick = 0.00;
        const speedInterval = 25; // Speed density parameter
        const structuralStep = targetValue / (400 / speedInterval); // Calculate step increments across 400ms runtime window

        const incrementTimer = setInterval(() => {
            currentTick += structuralStep;

            if (currentTick >= targetValue) {
                cgpaCounter.textContent = targetValue.toFixed(2);
                clearInterval(incrementTimer);
            } else {
                cgpaCounter.textContent = currentTick.toFixed(2);
            }
        }, speedInterval);
    }

    // ==========================================
    // INTERSECTION MONITOR ASSEMBLY
    // ==========================================
    const eduObserverOptions = {
        root: null,
        threshold: 0.2
    };

    const eduObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Initialize the counter animation sequence
                bootOledOdometer();

                // Fire background circuit board line systems illumination state
                tracePaths.forEach(path => path.classList.add('path-active'));
            }
        });
    }, eduObserverOptions);

    if (eduSection) {
        eduObserver.observe(eduSection);
    }

    // ==========================================
    // HARDWARE CARD BUS FOCUS SYNC CONTROLLER
    // ==========================================
    hardwareCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove active frame locks from alternative components
            hardwareCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Intentionally shift vector trace properties to match specialized focus
            const targetNode = card.getAttribute('data-node');
            if (targetNode === 'primary') {
                tracePaths.forEach(path => path.style.stroke = 'rgba(6, 182, 212, 0.25)');
            } else if (targetNode === 'electronics') {
                tracePaths.forEach(path => path.style.stroke = 'rgba(217, 70, 239, 0.25)');
            } else if (targetNode === 'cloud') {
                tracePaths.forEach(path => path.style.stroke = 'rgba(168, 85, 247, 0.25)');
            }
        });

        card.addEventListener('mouseleave', () => {
            // Revert background systems coloring back to baseline layout matrices
            tracePaths.forEach(path => path.style.stroke = '');
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const languageSection = document.getElementById('languages');
    const bandwidthMeters = document.querySelectorAll('.bandwidth-fill');

    // Create high-performance IntersectionObserver configuration
    const languageObserverOptions = {
        root: null,
        threshold: 0.25 // Fires precisely when 25% of the element context clips open on screen
    };

    const languageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Iterate across each bandwidth rail and inject custom CSS variables parameters
            bandwidthMeters.forEach(meter => {
                const finalWidth = meter.style.getPropertyValue('--target-width') ||
                    meter.getAttribute('style').match(/--target-width:\s*([^;]+)/)[1];

                meter.style.width = finalWidth;
            });

            // Cleanly unobserve section once state operations settle successfully
            observer.unobserve(entry.target);
        });
    }, languageObserverOptions);

    if (languageSection) {
        languageObserver.observe(languageSection);
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("aerospace-radar-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const airplanes = [];
    const mouse = { x: null, y: null, active: false };
    let radarAngle = 0;

    window.addEventListener("resize", () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    });

    const section = document.getElementById("contact");
    section.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    section.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    // ==========================================
    // PROCEDURAL AIRPLANE VECTOR MATRIX
    // ==========================================
    class TelemetryAircraft {
        constructor() {
            this.reset();
            // Stagger spawning fields across runtime initiation canvas footprints
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }

        reset() {
            this.baseId = Math.floor(1000 + Math.random() * 9000);
            this.x = Math.random() > 0.5 ? -20 : w + 20;
            this.y = Math.random() * (h * 0.8) + (h * 0.1);
            this.speed = Math.random() * 0.6 + 0.3;
            this.heading = Math.random() > 0.5 ? 0 : Math.PI;
            this.scale = Math.random() * 0.4 + 0.6;
            this.opacity = 0;
        }

        update() {
            // Apply straight vector mathematics heading components
            this.x += Math.cos(this.heading) * this.speed;
            this.y += Math.sin(this.heading) * this.speed;

            // Simple off-screen garbage collection recycling loops
            if (this.x < -40 || this.x > w + 40) this.reset();
        }

        drawRadarPing(angle) {
            // Calculate vector cross-deltas relative to absolute canvas coordinates
            let dx = this.x - w / 2;
            let dy = this.y - h / 2;
            let targetAngle = Math.atan2(dy, dx);
            if (targetAngle < 0) targetAngle += Math.PI * 2;

            let angleDiff = Math.abs(angle - targetAngle);
            if (angleDiff < 0.15) {
                this.opacity = 1.0; // Glow completely illuminates if radar intercept hits target
            } else {
                this.opacity -= 0.004; // Fade tail log cleanly
                if (this.opacity < 0) this.opacity = 0;
            }

            if (this.opacity <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.heading + Math.PI / 2);

            // Draw Premium Procedural Aircraft Vector
            ctx.strokeStyle = `rgba(37, 99, 235, ${this.opacity})`;
            ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity * 0.15})`;
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(0, -12 * this.scale); // Nose
            ctx.lineTo(10 * this.scale, 2 * this.scale); // Right wing tip
            ctx.lineTo(3 * this.scale, 2 * this.scale); // Wing join
            ctx.lineTo(2 * this.scale, 10 * this.scale); // Tail join
            ctx.lineTo(5 * this.scale, 12 * this.scale); // Horizontal tail wing
            ctx.lineTo(0, 10 * this.scale);
            ctx.lineTo(-5 * this.scale, 12 * this.scale);
            ctx.lineTo(-2 * this.scale, 10 * this.scale);
            ctx.lineTo(-3 * this.scale, 2 * this.scale);
            ctx.lineTo(-10 * this.scale, 2 * this.scale);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Render HUD Ticker Call Sign Labels Meta Blocks next to vehicle coordinates
            ctx.rotate(-(this.heading + Math.PI / 2));
            ctx.font = "8px monospace";
            ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity * 0.8})`;
            ctx.fillText(`FN_#${this.baseId}`, 15, -5);
            ctx.fillText(`ALT_${Math.floor(this.y * 10)}FT`, 15, 5);

            ctx.restore();
        }
    }

    // Populate the global simulation registry with 8 active aircraft loops
    for (let i = 0; i < 8; i++) airplanes.push(new TelemetryAircraft());

    // ==========================================
    // FRACTAL ELECTRIC CIRCUIT ARCS WRAPPER
    // ==========================================
    function createElectricalLightningArc(startX, startY, endX, endY, branches) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        let dx = endX - startX;
        let dy = endY - startY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let segmentsCount = Math.floor(distance / 12);

        let cx = startX;
        let cy = startY;

        for (let i = 1; i < segmentsCount; i++) {
            let ratio = i / segmentsCount;
            let tx = startX + dx * ratio;
            let ty = startY + dy * ratio;

            // Inject chaotic orthogonal random coordinate offsets properties
            let jitterAmount = (Math.random() - 0.5) * 16;
            cx = tx + (dy / distance) * jitterAmount;
            cy = ty - (dx / distance) * jitterAmount;

            ctx.lineTo(cx, cy);
        }

        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "rgba(147, 197, 253, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#2563eb";
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset canvas context properties loop immediately
    }

    // ==========================================
    // RENDER RECURSIVE TICK ANIMATION MASTER LOOP
    // ==========================================
    function processRadarPipeline() {
        // Create an organic lingering sweep decay background frame matrix
        ctx.fillStyle = "rgba(2, 4, 8, 0.06)";
        ctx.fillRect(0, 0, w, h);

        // Incremental trigonometry sweep rotations
        radarAngle += 0.012;
        if (radarAngle > Math.PI * 2) radarAngle = 0;

        // Render Static Technical Radar Sub-Systems Framework Lines Rings
        ctx.strokeStyle = "rgba(37, 99, 235, 0.03)";
        ctx.lineWidth = 1;
        const maxCircleRadius = Math.max(w, h) * 0.6;
        for (let r = 100; r < maxCircleRadius; r += 150) {
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw Active Radar Sweep Beam Ray
        let sweepEndX = w / 2 + Math.cos(radarAngle) * maxCircleRadius;
        let sweepEndY = h / 2 + Math.sin(radarAngle) * maxCircleRadius;

        let sweepGrad = ctx.createLinearGradient(w / 2, h / 2, sweepEndX, sweepEndY);
        sweepGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)");
        sweepGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = sweepGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(sweepEndX, sweepEndY);
        ctx.stroke();

        // Execution of Aircraft Compute Matrices & Lightning Arc Proximity Locks
        airplanes.forEach(plane => {
            plane.update();
            plane.drawRadarPing(radarAngle);

            // Compute proximity distance loops matching mouse inputs
            if (mouse.active) {
                let distanceDeltaX = mouse.x - plane.x;
                let distanceDeltaY = mouse.y - plane.y;
                let proximityRange = Math.sqrt(distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY);

                // If airplane enters 180px click range threshold, discharge circuit energy
                if (proximityRange < 180 && Math.random() > 0.85) {
                    createElectricalLightningArc(plane.x, plane.y, mouse.x, mouse.y);
                }
            }
        });

        requestAnimationFrame(processRadarPipeline);
    }
    processRadarPipeline();

    // ==========================================
    // SUB-PIXEL RIGID MAGNETIC LINKS ASSEMBLY
    // ==========================================
    const targetLinks = document.querySelectorAll("[data-magnetic]");
    targetLinks.forEach(link => {
        link.addEventListener("mousemove", function (e) {
            const bbox = this.getBoundingClientRect();
            const localOffsetX = e.clientX - bbox.left - bbox.width / 2;
            const localOffsetY = e.clientY - bbox.top - bbox.height / 2;

            this.style.transform = `translate(${localOffsetX * 0.22}px, ${localOffsetY * 0.3}px)`;

            const arrowElement = this.querySelector('.cl-arr');
            if (arrowElement) {
                arrowElement.style.transform = `translate(${localOffsetX * 0.1}px, ${localOffsetY * 0.1}px) rotate(0deg)`;
            }
        });

        link.addEventListener("mouseleave", function () {
            this.style.transform = "translate(0px, 0px)";
            this.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";

            const arrowElement = this.querySelector('.cl-arr');
            if (arrowElement) {
                arrowElement.style.transform = "";
                arrowElement.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
            }
        });

        link.addEventListener("mouseenter", function () {
            this.style.transition = "none";
            const arrowElement = this.querySelector('.cl-arr');
            if (arrowElement) arrowElement.style.transition = "none";
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const liveTimeSlot = document.getElementById("footer-live-timestamp");
    if (!liveTimeSlot) return;

    function refreshTerminalOdometer() {
        const structuralDateObj = new Date();

        // Extract parameters safely padding zero integers to match terminal design alignments
        const numericHours = String(structuralDateObj.getHours()).padStart(2, '0');
        const numericMinutes = String(structuralDateObj.getMinutes()).padStart(2, '0');
        const numericSeconds = String(structuralDateObj.getSeconds()).padStart(2, '0');

        // Dynamically compute basic zone deviations
        const localZoneString = structuralDateObj.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();

        // Print values safely back to inner text node trees
        liveTimeSlot.textContent = `${numericHours}:${numericMinutes}:${numericSeconds} ${localZoneString}`;
    }

    // Initialize block operations cleanly on page load execution parameters
    refreshTerminalOdometer();

    // Attach intervals mapping task pools smoothly at exactly 1-second iterations
    setInterval(refreshTerminalOdometer, 1000);
});