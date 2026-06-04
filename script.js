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
    el.style.transitionDelay = Math.floor(i % 3) * 0.09 + "s";
    io.observe(el);
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

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* navy data stars */
const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.3,
    v: Math.random() * 0.25 + 0.05
}));

function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let s of stars) {
        s.y += s.v;

        if (s.y > h) s.y = 0;

        ctx.beginPath();
        ctx.fillStyle = "rgba(10, 30, 70, 0.65)";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(draw);
}

draw();

/* status messages */
const status = document.getElementById("status");

const messages = [
    "Preparing system...",
    "Loading research modules...",
    "Synchronizing data layers...",
    "Rendering interface...",
];

let i = 0;

setInterval(() => {
    if (i < messages.length) {
        status.textContent = messages[i];
        i++;
    }
}, 500);

/* exit */
setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
}, 3500);
