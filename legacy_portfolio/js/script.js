/**
 * ==============================================================================
 * NEXUS SQUAD // HACKATHON TEAM PORTFOLIO
 * High-Velocity Client-Side Controller
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    theme: localStorage.getItem('nexus-theme') || 'dark',
    soundEnabled: localStorage.getItem('nexus-sound') === 'true', // default muted unless user enables
    activeFilter: 'all',
    searchQuery: '',
    cmdHistory: [],
    cmdHistoryIndex: -1
  };

  // --- SOUND EFFECTS (Web Audio API Synthesizer) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio might be blocked by browser policy
      }
    }

    click() { this.playTone(880, 'sine', 0.04, 0.04); }
    pop() { this.playTone(540, 'triangle', 0.06, 0.05); }
    success() {
      this.playTone(523.25, 'sine', 0.08, 0.04);
      setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.04), 80);
      setTimeout(() => this.playTone(783.99, 'sine', 0.14, 0.05), 160);
    }
    terminalBlip() { this.playTone(1200, 'square', 0.03, 0.02); }
  }

  const sfx = new SoundFX();

  // --- TOAST NOTIFICATION SYSTEM ---
  function showToast(message, type = 'info', duration = 3800) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '⚡';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);

    if (type === 'success') sfx.success();
    else sfx.pop();

    setTimeout(() => {
      toast.style.animation = 'slide-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- THEME SYSTEM ---
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const footerThemeToggle = document.getElementById('footer-theme-toggle');

  function applyTheme(theme) {
    state.theme = theme;
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
  }

  function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    sfx.click();
    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info', 2200);
  }

  applyTheme(state.theme);
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (footerThemeToggle) footerThemeToggle.addEventListener('click', toggleTheme);

  // --- SOUND TOGGLE ---
  const soundToggleBtn = document.getElementById('sound-toggle');
  function updateSoundUI() {
    if (!state.soundEnabled) {
      document.body.classList.add('sound-muted');
    } else {
      document.body.classList.remove('sound-muted');
    }
  }

  if (soundToggleBtn) {
    updateSoundUI();
    soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('nexus-sound', state.soundEnabled);
      updateSoundUI();
      if (state.soundEnabled) {
        sfx.init();
        sfx.success();
        showToast('Sound Effects: Enabled 🔊', 'info', 2000);
      } else {
        showToast('Sound Effects: Muted 🔇', 'info', 2000);
      }
    });
  }

  // --- NAVBAR SCROLL & ACTIVE LINK SPY ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    // Navbar glass effect on scroll
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy for nav links
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      mobileToggleBtn.classList.toggle('open');
      mobileToggleBtn.setAttribute('aria-expanded', !isOpen);
      sfx.click();
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link, .mobile-menu-cta a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileToggleBtn.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- TYPEWRITER EFFECT IN HERO ---
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'production-grade AI agent pipelines in 36 hours.',
    'fail-safe decentralized smart contract protocols.',
    'real-time spatial audio for accessibility.',
    'high-converting hackathon stage pitch decks.',
    'zero-to-one functional MVPs that judges remember.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 50;

  function typeLoop() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 30;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 65;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      isDeleting = true;
      typeSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  }
  typeLoop();

  // --- STATS TICKER ANIMATION (Intersection Observer) ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          const duration = 1600; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              num.textContent = target;
              clearInterval(timer);
            } else {
              num.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // --- INTERACTIVE BACKGROUND PARTICLES CANVAS ---
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 42;
    let mouse = { x: null, y: null, radius: 140 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f5d4' : '#9d4edd';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 1.5;
            this.y -= Math.sin(angle) * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            const alpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = state.theme === 'dark' ? `rgba(0, 245, 212, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- PROJECT FILTERING & SEARCH ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');
  const projectCards = document.querySelectorAll('.project-card');
  const noProjectsMsg = document.getElementById('no-projects-msg');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');

  function filterProjects() {
    let visibleCount = 0;
    const query = state.searchQuery.toLowerCase().trim();

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.project-description')?.textContent.toLowerCase() || '';

      const matchesCat = state.activeFilter === 'all' || category === state.activeFilter;
      const matchesSearch = query === '' || 
                            title.includes(query) || 
                            desc.includes(query) || 
                            tags.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noProjectsMsg) {
      noProjectsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.activeFilter = btn.getAttribute('data-filter');
      sfx.click();
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      filterProjects();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      state.activeFilter = 'all';
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      filterButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      filterProjects();
      sfx.pop();
    });
  }

  // --- PROJECT DETAILS MODAL DATA ---
  const projectData = {
    pulseaid: {
      tag: "GLOBAL AI HACKATHON 2024 // 1ST PLACE OVERALL ($25,000)",
      title: "PulseAid AI — Autonomous Emergency Dispatch",
      award: "🥇 1st Place Overall & Grand Champion out of 450+ Teams",
      problem: "911 emergency centers face critical dispatch bottlenecks during major natural disasters. Multiple callers report the same crisis from different angles while cellular bandwidth degrades.",
      solution: "PulseAid autonomously ingests 100+ concurrent inbound voice streams using Whisper v3, groups duplicate incidents via spatial vector embeddings, cross-references satellite damage layers, and outputs prioritized routing coordinates to ambulances in under 4 seconds.",
      architecture: "Inbound audio stream -> WebRTC -> Whisper v3 on Modal GPU -> LangChain multi-agent triage reasoning -> PostgreSQL with pgvector -> Mapbox GL live dispatch UI.",
      builtIn: "36 hours at HackGlobal San Francisco",
      stack: ["Next.js 14", "FastAPI", "PyTorch", "Whisper v3", "LangChain", "Mapbox GL", "PostgreSQL", "Docker"],
      github: "https://github.com",
      demo: "https://devpost.com"
    },
    audiosight: {
      tag: "HACKMIT // BEST ACCESSIBILITY HACK",
      title: "AudioSight 3D — Spatial AR Guidance for Blind Pedestrians",
      award: "🏆 Best Inclusivity Hack & Twilio Track Winner",
      problem: "Standard screen-readers and GPS voice directions can distract pedestrians and mask vital ambient city cues like traffic noise and approaching hazards.",
      solution: "AudioSight runs lightweight edge object detection (YOLOv8) via smartphone camera and creates dynamic 3D binaural sound beacons that move in the user's spatial headphone soundscape. Users naturally steer away from obstacles without looking at a screen.",
      architecture: "React Native camera feed -> TensorFlow.js WebGL backend -> WebAudio API HRTF spatial panning engine -> Edge haptic feedback.",
      builtIn: "36 hours at HackMIT Cambridge",
      stack: ["React Native", "WebAudio API", "HRTF Spatial Panning", "TensorFlow.js", "YOLOv8 Edge", "Twilio Alerts"],
      github: "https://github.com",
      demo: "https://devpost.com"
    },
    devpulse: {
      tag: "CALHACKS 11.0 // BEST DEVELOPER TOOL TRACK",
      title: "DevPulse Kernel — Autonomous eBPF Sandbox Debugger",
      award: "🥇 1st Place DevTools Track ($10,000 Award)",
      problem: "When a production microservice crashes with an unhandled exception, engineering teams lose hours recreating the exact memory heap state and request headers.",
      solution: "DevPulse attaches eBPF kernel probes to trap panic signals, snapshots the exact container state into an isolated Firecracker microVM clone, feeds the stack trace to Claude Sonnet, and opens a GitHub PR with an automated unit test reproducing the bug.",
      architecture: "Rust eBPF kernel telemetry -> Firecracker microVM snapshot -> Anthropic Claude Sonnet API -> GitHub Webhooks -> Next.js visual dashboard.",
      builtIn: "36 hours at CalHacks UC Berkeley",
      stack: ["Rust", "eBPF (Aya)", "Firecracker microVM", "Claude Sonnet", "Docker", "WASM", "Next.js"],
      github: "https://github.com",
      demo: "https://devpost.com"
    },
    chainguard: {
      tag: "ETHGLOBAL SF // TOP 10 FINALIST & BEST SECURITY",
      title: "ChainGuard Sentry — Mempool Flash Attack Firewall",
      award: "🛡️ Top 10 Finalist & Best DeFi Defense Protocol",
      problem: "DeFi protocols regularly lose millions in seconds to flash-loan exploit bots before transactions can be analyzed or paused by humans.",
      solution: "A decentralized RPC node proxy that runs symbolic execution on pending mempool transactions to detect reentrancy bugs and liquidity drain signatures before block validation, simulating counter-frontrunning protection.",
      architecture: "Go-Ethereum customized node -> Foundry invariant test harness -> Viem TypeScript SDK -> EVM symbolic bytecode simulator.",
      builtIn: "36 hours at ETHGlobal San Francisco",
      stack: ["Solidity", "Foundry", "Go-Ethereum (geth)", "Viem", "TypeScript", "TailwindCSS"],
      github: "https://github.com",
      demo: "https://devpost.com"
    },
    ecoledger: {
      tag: "PENNAPPS XXIV // 1ST PLACE SUSTAINABILITY TRACK",
      title: "EcoLedger AI — Computer Vision Smart Dining Waste",
      award: "🥇 1st Place Sustainability & AWS Choice ($12,000 Prize)",
      problem: "University dining halls generate thousands of tons of contaminated compost waste because students struggle to differentiate compostable from non-compostable packaging.",
      solution: "A retrofitted bin equipped with a Raspberry Pi 5 and high-speed camera that identifies discarded materials in 400ms using local computer vision, indicates the correct disposal slot with dynamic LED signals, and credits student campus cards with carbon rewards.",
      architecture: "Raspberry Pi 5 + OpenCV -> AWS IoT Core -> Supabase realtime database -> Next.js live student leaderboards.",
      builtIn: "36 hours at PennApps Univ. of Pennsylvania",
      stack: ["Raspberry Pi 5", "OpenCV", "Python", "AWS IoT Core", "Supabase", "Next.js 14", "TailwindCSS"],
      github: "https://github.com",
      demo: "https://devpost.com"
    },
    flowstate: {
      tag: "TREEHACKS STANFORD // MOST DELIGHTFUL UX",
      title: "FlowState Neuro — Bio-Adaptive Focus Synthesizer",
      award: "✨ Most Innovative UX Award ($6,500 Prize)",
      problem: "Developer burnout and context switching severely hinder deep work sprint states during intense 36-hour hackathons.",
      solution: "A web workspace that tracks typing rhythm and subtle webcam eye fixation patterns to generate real-time ambient 3D visuals and generative binaural beat audio that dynamically adapts tempo as focus wanes.",
      architecture: "WebGazer eye tracking -> Web Audio Tone.js generative synth -> Three.js shader particle canvas -> Local IndexedDB focus analytics.",
      builtIn: "36 hours at TreeHacks Stanford",
      stack: ["Three.js", "Tone.js", "WebGazer.js", "Web Audio API", "TailwindCSS", "React"],
      github: "https://github.com",
      demo: "https://devpost.com"
    }
  };

  // Open Project Modal
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('modal-close');
  const projectModalBody = document.getElementById('modal-project-content');

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data || !projectModal || !projectModalBody) return;

    projectModalBody.innerHTML = `
      <div class="modal-header-tag">${data.tag}</div>
      <h2 class="modal-title">${data.title}</h2>
      <div class="modal-award-badge">${data.award}</div>

      <div class="modal-section-title">// THE PROBLEM</div>
      <p class="modal-text">${data.problem}</p>

      <div class="modal-section-title">// 36-HOUR BREAKTHROUGH SOLUTION</div>
      <p class="modal-text">${data.solution}</p>

      <div class="modal-section-title">// ARCHITECTURE &amp; PIPELINE</div>
      <p class="modal-text"><code>${data.architecture}</code></p>

      <div class="modal-section-title">// BATTLE-TESTED TECH STACK</div>
      <div class="modal-stack-tags">
        ${data.stack.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Devpost Submission ↗</a>
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">GitHub Source ↗</a>
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sfx.pop();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projKey = btn.getAttribute('data-project');
      openProjectModal(projKey);
    });
  });

  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --- TEAM MEMBER DEEP DIVE MODAL DATA ---
  const memberData = {
    alex: {
      name: "Alex Rivera",
      role: "Team Captain & Full-Stack Architect",
      location: "San Francisco, CA",
      tagline: "Turns impossible 36h requirements into bulletproof APIs.",
      stats: [
        { label: "0-to-1 Architecture", value: "98%" },
        { label: "Next.js / TypeScript", value: "96%" },
        { label: "Go & High-Concurrency APIs", value: "92%" },
        { label: "3:00 AM Crisis Handling", value: "100%" }
      ],
      bio: "Alex founded Nexus in 2023 after realizing that the best hackathon teams aren't the ones with the flashiest slides, but the ones with unshakeable architectural discipline. He enforces strict API contracts within the first 3 hours so frontend and backend can code at full velocity without waiting on each other.",
      fuel: "Iced Double Espresso & Sea Salt Almonds",
      bestMemory: "Fixing a broken production database connection string on the mainstage 40 seconds before presenting at HackGlobal.",
      gear: "M3 Max MacBook Pro 16\", Neovim + VS Code, Split Ortholinear Keyboard"
    },
    elena: {
      name: "Elena Rostova",
      role: "AI / ML Engineer & Agent Architect",
      location: "Boston, MA",
      tagline: "Fine-tunes models that make judges question the laws of physics.",
      stats: [
        { label: "PyTorch & HuggingFace", value: "97%" },
        { label: "Multi-Agent Orchestration", value: "95%" },
        { label: "Latency & GPU Optimization", value: "94%" },
        { label: "Prompt Engineering & RAG", value: "99%" }
      ],
      bio: "Elena is a machine learning researcher focused on low-latency inference at the edge. At hackathons, she builds custom multi-agent DAGs that handle multimodal audio and visual data with sub-second response times, giving Nexus projects their trademark 'how does this actually work live?!' factor.",
      fuel: "Matcha Latte & Dark Chocolate (85%)",
      bestMemory: "Deploying a quantized Whisper model to a remote GPU server over a shaky convention center Wi-Fi tether.",
      gear: "ThinkPad P1 + RTX 4090 Cloud Rig, PyTorch, Modal Labs, Ollama"
    },
    marcus: {
      name: "Marcus Chen",
      role: "UI/UX Designer & Creative Frontend Wizard",
      location: "New York, NY",
      tagline: "Translates technical complexity into interfaces judges fall in love with.",
      stats: [
        { label: "Figma Rapid Prototyping", value: "99%" },
        { label: "TailwindCSS & Framer Motion", value: "96%" },
        { label: "Three.js / WebGL Visuals", value: "94%" },
        { label: "Visual Hierarchy & Polish", value: "98%" }
      ],
      bio: "Marcus ensures that no Nexus prototype ever looks like an unstyled hackathon project. He works in lockstep with Alex, transforming wireframes into 60fps responsive interfaces in Figma, then straight into typed React code with micro-interactions that captivate judges during the crucial 3-minute pitch.",
      fuel: "Cold Brew with Oat Milk & Gummy Bears",
      bestMemory: "Live-designing an interactive 3D globe animation in Three.js at TreeHacks with 35 minutes left on the countdown clock.",
      gear: "MacBook Pro 14\", Figma, Tailwind, Spline 3D, Wacom Tablet"
    },
    sophia: {
      name: "Sophia Patel",
      role: "Cloud / DevOps & Pitch Commander",
      location: "Austin, TX",
      tagline: "Deploys zero-downtime infra and delivers stage-dominating pitches.",
      stats: [
        { label: "3-Minute Pitch Storytelling", value: "99%" },
        { label: "AWS / Docker / Cloudflare", value: "95%" },
        { label: "Live Demo Fail-Safe Rigging", value: "100%" },
        { label: "Q&A Defense & Strategy", value: "96%" }
      ],
      bio: "Sophia is the secret weapon of Nexus. While managing CI/CD pipelines, container orchestration, and serverless edge deployments, she crafts the pitch deck narrative from hour 1. She spends the final 6 hours grilling the team on judge questions, rehearsing the hook, and preparing high-def offline backups.",
      fuel: "Yerba Mate & Sour Patch Kids",
      bestMemory: "Captivating a packed auditorium at CalHacks with an opening hook that had the judges laughing and leaning in from second 5.",
      gear: "MacBook Air M2 + Linux Server, Docker, AWS CLI, Pitch.com, Screen Studio"
    }
  };

  const memberModal = document.getElementById('member-modal');
  const memberModalClose = document.getElementById('member-modal-close');
  const memberModalBody = document.getElementById('modal-member-content');

  function openMemberModal(key) {
    const mem = memberData[key];
    if (!mem || !memberModal || !memberModalBody) return;

    memberModalBody.innerHTML = `
      <div class="modal-header-tag">// SQUAD MEMBER PROFILE</div>
      <h2 class="modal-title">${mem.name}</h2>
      <div class="modal-award-badge">${mem.role} &bull; ${mem.location}</div>
      <p class="modal-text" style="font-weight: 600; color: var(--accent-cyan); margin-bottom: 16px;">"${mem.tagline}"</p>

      <div class="modal-section-title">// HACKATHON SUPERPOWERS</div>
      <div class="skill-meter-group">
        ${mem.stats.map(s => `
          <div class="skill-meter">
            <span class="meter-label">${s.label} (${s.value})</span>
            <div class="meter-bar"><div class="meter-fill" style="width: ${s.value};"></div></div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title">// HACKATHON BIO &amp; DNA</div>
      <p class="modal-text">${mem.bio}</p>

      <div class="modal-section-title">// HACKATHON BATTLE GEAR &amp; FUEL</div>
      <p class="modal-text"><strong>Preferred Sprint Fuel:</strong> ${mem.fuel}</p>
      <p class="modal-text"><strong>Hardware &amp; Setup:</strong> ${mem.gear}</p>
      <p class="modal-text"><strong>Favorite Clutch Moment:</strong> ${mem.bestMemory}</p>

      <div class="modal-actions">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">GitHub Profile ↗</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">LinkedIn ↗</a>
      </div>
    `;

    memberModal.classList.add('active');
    memberModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    sfx.pop();
  }

  function closeMemberModal() {
    if (!memberModal) return;
    memberModal.classList.remove('active');
    memberModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.member-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const memKey = btn.getAttribute('data-member');
      openMemberModal(memKey);
    });
  });

  if (memberModalClose) memberModalClose.addEventListener('click', closeMemberModal);
  if (memberModal) {
    memberModal.addEventListener('click', (e) => {
      if (e.target === memberModal) closeMemberModal();
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeMemberModal();
    }
  });

  // --- HACKER CLI TERMINAL ---
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  const cliCommands = {
    help: () => `
<div class="term-line term-cyan">AVAILABLE COMMANDS:</div>
<div class="term-line">  <span class="term-yellow">help</span>        - Display this command manual</div>
<div class="term-line">  <span class="term-yellow">team</span>        - List squad members and specialties</div>
<div class="term-line">  <span class="term-yellow">projects</span>    - List award-winning hackathon builds</div>
<div class="term-line">  <span class="term-yellow">trophies</span>    - Show podium finishes and grants</div>
<div class="term-line">  <span class="term-yellow">playbook</span>    - Print our 36-hour sprint formula</div>
<div class="term-line">  <span class="term-yellow">stats</span>       - Output team win rates and metrics</div>
<div class="term-line">  <span class="term-yellow">stack</span>       - Print core tech stack tools</div>
<div class="term-line">  <span class="term-yellow">contact</span>     - View transmission and booking info</div>
<div class="term-line">  <span class="term-yellow">theme</span>       - Toggle UI theme (dark / light)</div>
<div class="term-line">  <span class="term-yellow">sudo win</span>    - Execute instant grand prize protocol</div>
<div class="term-line">  <span class="term-yellow">clear</span>       - Clear the terminal console</div>
    `,
    team: () => `
<div class="term-line term-cyan">NEXUS SQUAD ROSTER [4 ACTIVE OPERATORS]:</div>
<div class="term-line">  [AR] <span class="term-yellow">Alex Rivera</span>   - Team Captain & Full-Stack Architect (Next.js, Node, Go)</div>
<div class="term-line">  [ER] <span class="term-yellow">Elena Rostova</span> - AI/ML Specialist & Agent Engineer (PyTorch, LangChain, YOLO)</div>
<div class="term-line">  [MC] <span class="term-yellow">Marcus Chen</span>   - UI/UX Designer & Creative Frontend (Three.js, Tailwind, Figma)</div>
<div class="term-line">  [SP] <span class="term-yellow">Sophia Patel</span>  - Cloud/DevOps & Pitch Commander (AWS, Docker, Storytelling)</div>
    `,
    projects: () => `
<div class="term-line term-cyan">AWARD-WINNING HACKATHON BUILDS:</div>
<div class="term-line">  🥇 <span class="term-yellow">PulseAid AI</span>       - 1st Place HackGlobal '24 (Autonomous 911 dispatch)</div>
<div class="term-line">  🏆 <span class="term-yellow">AudioSight 3D</span>     - Best Accessibility HackMIT (Spatial AR guidance)</div>
<div class="term-line">  ⚡ <span class="term-yellow">DevPulse Kernel</span>   - 1st DevTools CalHacks 11.0 (eBPF sandbox debugger)</div>
<div class="term-line">  🛡️ <span class="term-yellow">ChainGuard Sentry</span> - Finalist ETHGlobal SF (Mempool exploit firewall)</div>
<div class="term-line">  🌱 <span class="term-yellow">EcoLedger AI</span>      - 1st Sustainability PennApps XXIV (Smart dining IoT)</div>
<div class="term-line">  🧠 <span class="term-yellow">FlowState Neuro</span>   - Most Innovative UX TreeHacks (Adaptive focus synth)</div>
    `,
    trophies: () => `
<div class="term-line term-cyan">TROPHY CABINET &amp; GRANTS ($72,000+ TOTAL):</div>
<div class="term-line">  🥇 2024 - HackGlobal Overall Grand Champion ($25,000)</div>
<div class="term-line">  🥇 2024 - PennApps XXIV 1st Place Sustainability ($12,000)</div>
<div class="term-line">  🛡️ 2024 - ETHGlobal SF Finalist & Best Security ($10,000)</div>
<div class="term-line">  🏆 2024 - HackMIT Best Inclusivity & Twilio Award ($8,000)</div>
<div class="term-line">  ⚡ 2023 - CalHacks 11.0 Best DevTool Track ($7,500)</div>
<div class="term-line">  ✨ 2023 - TreeHacks Stanford Most Innovative UX ($6,500)</div>
    `,
    playbook: () => `
<div class="term-line term-cyan">36-HOUR SPRINT FORMULA:</div>
<div class="term-line">  [00h-04h] Pitch 10 ideas -> Kill 9 -> Lock problem statement & Figma wireframes.</div>
<div class="term-line">  [04h-20h] Parallel core sprint (Frontend mocks schema, Backend ships real APIs).</div>
<div class="term-line">  [20h-28h] Polish edge cases, populate rich live mock data, test fallback errors.</div>
<div class="term-line">  [28h-36h] The Hollywood Pitch (Screen b-roll, 3-minute rehearsed hook, slide deck).</div>
    `,
    stats: () => `
<div class="term-line term-cyan">PERFORMANCE METRICS:</div>
<div class="term-line">  Hackathons Competed:  14</div>
<div class="term-line">  Podium Win Rate:      71.4% (10 Podiums)</div>
<div class="term-line">  Bounties & Grants:    $72,000+ USD</div>
<div class="term-line">  Working Demos:        100% (Zero slides-only hacks)</div>
<div class="term-line">  Caffeine Consumed:    ~1,420 cups of cold brew</div>
    `,
    stack: () => `
<div class="term-line term-cyan">WEAPONS OF CHOICE:</div>
<div class="term-line">  Frontend: Next.js 14, React, TypeScript, TailwindCSS, Three.js</div>
<div class="term-line">  Backend:  FastAPI, Python, Node.js, Go, Supabase, Redis, Docker</div>
<div class="term-line">  AI/ML:    PyTorch, Hugging Face, Claude Sonnet, OpenAI, Whisper, LangChain</div>
<div class="term-line">  Infra:    Vercel, AWS Activate, Cloudflare Workers, GitHub Actions</div>
    `,
    contact: () => `
<div class="term-line term-cyan">TRANSMISSION CHANNELS:</div>
<div class="term-line">  Email:    <span class="term-yellow">team@nexussquad.dev</span></div>
<div class="term-line">  GitHub:   github.com/nexus-squad</div>
<div class="term-line">  Devpost:  devpost.com/nexus-squad</div>
<div class="term-line">  Discord:  discord.gg/nexus-hackers</div>
    `,
    theme: () => {
      toggleTheme();
      return `<div class="term-line term-green">UI Theme toggled to: ${state.theme.toUpperCase()}</div>`;
    },
    'sudo win': () => `
<div class="term-line term-green">[AUTHENTICATED AS ROOT]</div>
<div class="term-line">Running protocol: WIN_ALL_TRACKS...</div>
<div class="term-line term-cyan">Deploying flawless 3-minute demo... [DONE]</div>
<div class="term-line term-yellow">Judges blown away: 100%</div>
<div class="term-line term-purple">Check presented: 🥇 FIRST PLACE TROPHY ACQUIRED.</div>
    `,
    date: () => `<div class="term-line">Current UTC Timestamp: ${new Date().toUTCString()}</div>`,
    clear: () => {
      if (terminalBody) terminalBody.innerHTML = '';
      return '';
    }
  };

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        terminalInput.value = '';
        if (!rawCmd) return;

        state.cmdHistory.push(rawCmd);
        state.cmdHistoryIndex = state.cmdHistory.length;

        // Print input line
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="term-prompt">guest@nexus:~$</span> <span>${rawCmd}</span>`;
        terminalBody.appendChild(echoLine);

        sfx.terminalBlip();

        // Interpret command
        const cleanCmd = rawCmd.toLowerCase();
        let outputHtml = '';

        if (cliCommands[cleanCmd]) {
          outputHtml = cliCommands[cleanCmd]();
        } else if (cleanCmd.startsWith('team ')) {
          const memberKey = cleanCmd.split(' ')[1];
          if (memberData[memberKey]) {
            const m = memberData[memberKey];
            outputHtml = `<div class="term-line term-cyan">${m.name} [${m.role}]</div><div class="term-line">${m.bio}</div>`;
          } else {
            outputHtml = `<div class="term-line term-red">Unknown squad member '${memberKey}'. Try 'alex', 'elena', 'marcus', or 'sophia'.</div>`;
          }
        } else {
          outputHtml = `<div class="term-line term-red">Command not recognized: '${rawCmd}'. Type <span class="term-yellow">'help'</span> for a list of commands.</div>`;
        }

        if (outputHtml) {
          const resBlock = document.createElement('div');
          resBlock.innerHTML = outputHtml;
          terminalBody.appendChild(resBlock);
        }

        // Auto-scroll
        terminalBody.scrollTop = terminalBody.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        if (state.cmdHistory.length > 0 && state.cmdHistoryIndex > 0) {
          state.cmdHistoryIndex--;
          terminalInput.value = state.cmdHistory[state.cmdHistoryIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (state.cmdHistoryIndex < state.cmdHistory.length - 1) {
          state.cmdHistoryIndex++;
          terminalInput.value = state.cmdHistory[state.cmdHistoryIndex] || '';
        } else {
          state.cmdHistoryIndex = state.cmdHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  // --- COPY EMAIL TO CLIPBOARD ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const teamEmail = 'team@nexussquad.dev';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(teamEmail).then(() => {
        if (copyText) copyText.textContent = '✓ Copied to Clipboard!';
        showToast('Email address copied to clipboard!', 'success');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy Email Address';
        }, 2500);
      }).catch(() => {
        showToast('Failed to copy. Please manually copy team@nexussquad.dev', 'error');
      });
    });
  }

  // --- CONTACT FORM HANDLING & VALIDATION ---
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const successBanner = document.getElementById('form-success-banner');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        hasError = true;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (hasError) {
        showToast('Please fix the errors in the form before sending', 'error');
        return;
      }

      // Simulation of submission
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (btnText && btnLoading) {
          btnText.style.display = 'inline-block';
          btnLoading.style.display = 'none';
          submitBtn.disabled = false;
        }

        contactForm.reset();
        if (successBanner) {
          successBanner.style.display = 'flex';
          setTimeout(() => {
            successBanner.style.display = 'none';
          }, 6000);
        }

        showToast('Signal transmitted! Our captain will respond within 24h.', 'success', 5000);
      }, 1200);
    });

    // Remove error classes on input
    [nameInput, emailInput, messageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => {
          inp.closest('.form-group')?.classList.remove('has-error');
        });
      }
    });
  }

  // --- LIVE FOOTER SYSTEM CLOCK ---
  const liveClock = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    liveClock.textContent = `${utcHours}:${utcMins}:${utcSecs} UTC`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  console.log("%c⚡ NEXUS SQUAD // Portfolio System Initialized", "color: #00f5d4; font-size: 14px; font-weight: bold; background: #0a0b10; padding: 4px 8px; border-radius: 4px;");
});
