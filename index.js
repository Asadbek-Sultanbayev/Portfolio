/* ================================================
   ASADBEK SULTANBAEV — PORTFOLIO JAVASCRIPT
   Particles, Smooth Scroll, Reveal, Interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── PARTICLE CANVAS ──────────────────────────
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 150;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 0.5;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
            this.alpha = this.baseAlpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.alpha = Math.min(1, this.baseAlpha + (1 - dist / 120) * 0.6);
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Mouse connections
        if (mouse.x !== null) {
            for (const p of particles) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const alpha = (1 - dist / 180) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // ── SCROLL REVEAL ────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ── SMOOTH SCROLL FOR CTA BUTTONS ────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ── TYPING EFFECT ON HERO GREETING ───────────
    const greeting = document.querySelector('.hero-greeting');
    if (greeting) {
        const text = greeting.textContent;
        greeting.textContent = '';
        greeting.style.visibility = 'visible';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                greeting.textContent += text[i];
                i++;
                setTimeout(typeChar, 80);
            }
        }
        setTimeout(typeChar, 500);
    }


    // ── HANDLE PROFILE IMAGE FALLBACK ────────────
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg) {
        profileImg.addEventListener('error', () => {
            profileImg.style.display = 'none';
        });
    }


    // ── PROJECT VIDEOS: PLAY ONLY WHEN VISIBLE ───
    const projectVideos = document.querySelectorAll('.project-video');
    if (projectVideos.length) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const vid = entry.target;
                if (entry.isIntersecting) {
                    vid.play().catch(() => { });
                } else {
                    vid.pause();
                }
            });
        }, { threshold: 0.25 });

        projectVideos.forEach((vid) => {
            videoObserver.observe(vid);
            vid.addEventListener('error', () => {
                console.warn('Video failed to load:', vid.currentSrc);
            });
        });
    }

});
