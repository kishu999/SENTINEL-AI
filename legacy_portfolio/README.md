# ⚡ NEXUS SQUAD // Elite Hackathon Team Portfolio

A modern, high-velocity, fully responsive hackathon team portfolio website engineered with pure **HTML5**, **CSS3**, and **modern JavaScript** (ES6+). Zero external framework dependencies or build steps required.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vanilla](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue.svg)
![Responsive](https://img.shields.io/badge/responsive-mobile%20%7C%20tablet%20%7C%20desktop-cyan.svg)

---

## 🚀 Key Features

- **Cyber-Tech Aesthetic with Dual Theme Support**:
  - Dark Mode (Obsidian & Cyber Cyan / Violet) as default.
  - Crisp Modern Tech Light Mode.
  - Persisted in `localStorage` with smooth CSS transitions.

- **Interactive Background Particles Canvas**:
  - Constellation particle simulation that reacts to mouse movement and window resizing without heavy libraries.

- **Hero Section**:
  - Dynamic typewriter effect cycling through team superpowers.
  - Live animated stat counters with `IntersectionObserver`.
  - Availability pill indicator and quick action CTAs.

- **Battle-Tested Hackathon Builds Showcase**:
  - Real-time search by project name, tech stack, or hackathon.
  - Category filter tabs (`All`, `AI & Agents`, `Web3 / FinTech`, `Health & Impact`, `DevTools`).
  - Interactive deep-dive modal for each project with Problem, 36h Breakthrough, Architecture, and Tech Stack.

- **The Squad (Team Member Profiles)**:
  - 4 complementary roles: Team Captain / Full-Stack Architect, AI/ML Specialist, UI/UX Designer & Creative Frontend, and Cloud/DevOps & Pitch Commander.
  - Interactive animated skill meters.
  - Deep-dive profile modals with backstories, preferred 3AM hackathon fuels, and battle gear.

- **Trophy Cabinet & Accolades**:
  - Timeline of podium finishes and grand champions (HackGlobal, PennApps, ETHGlobal, HackMIT, CalHacks, TreeHacks).
  - Sponsor track awards list (Google Cloud, AWS, Twilio, OpenAI, etc.).

- **The 36-Hour Sprint Playbook**:
  - Detailed breakdown of our 4-phase winning formula from hour 0 to 36.

- **Interactive Hacker Terminal (CLI)**:
  - Embedded command-line console supporting commands like `help`, `team`, `projects`, `trophies`, `stats`, `playbook`, `stack`, `contact`, `theme`, `sudo win`, and `clear`.
  - Command history navigation with `Up` and `Down` arrow keys.

- **Built-in Web Audio Sound FX**:
  - Pure Web Audio API synthesizer generating futuristic clicks, blips, and victory chords.
  - Easily toggled on/off with UI indicator.

- **Encrypted Transmission (Contact) Form**:
  - Client-side validation for Name, Email, Purpose, and Message.
  - Simulated encrypted pipeline transmission with loading states and toast notifications.
  - 1-click "Copy Email" with instant clipboard integration.

- **Responsive & Accessible**:
  - Fully mobile-ready with an animated hamburger drawer navigation.
  - Mobile touch targets, clean semantic tags, and smooth scrolling.

---

## 📂 Project Structure

```
antigravity/
│
├── index.html          # Semantic HTML5 markup with all sections & modals
├── css/
│   └── style.css       # Responsive cyber-tech CSS, design tokens & dark/light theme
├── js/
│   └── script.js       # Dynamic interactions, canvas particles, CLI, modals & audio
└── README.md           # Documentation and guide
```

---

## 💻 How to Run

Because this site is built purely with vanilla web standards, **no build step, npm install, or bundler is needed**!

### Option 1: Open Directly
Simply double-click `index.html` or open it in your browser of choice (Chrome, Edge, Firefox, Safari).

### Option 2: Live Server (VS Code / Extension)
If using VS Code, right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Deploy Free Online in 60 Seconds
- **GitHub Pages**: Push this repo to GitHub, go to `Settings -> Pages`, and select `main` branch.
- **Vercel / Netlify**: Drag-and-drop the folder or connect your repo for instant zero-config hosting.

---

## 🛠️ Customizing the Portfolio

### Changing Team Members
Open `js/script.js` and locate the `memberData` object:
```javascript
const memberData = {
  alex: {
    name: "Your Name",
    role: "Your Role",
    location: "City, State",
    // Customize stats, bio, fuel, and gear
  }
};
```
Also update the corresponding cards in `index.html` under `<section id="team">`.

### Adding or Modifying Projects
Open `js/script.js` and find the `projectData` object:
```javascript
const projectData = {
  myproject: {
    tag: "HACKATHON NAME // AWARD",
    title: "Project Title",
    award: "🥇 1st Place",
    problem: "...",
    solution: "...",
    architecture: "...",
    stack: ["React", "FastAPI", "OpenAI"],
    github: "https://github.com/...",
    demo: "https://devpost.com/..."
  }
};
```
Add the card in `index.html` under `<div class="projects-grid">`.

### Adding CLI Commands
In `js/script.js`, extend the `cliCommands` dictionary:
```javascript
const cliCommands = {
  discord: () => `<div class="term-line">Join our server at discord.gg/yourlink</div>`,
  // ...
};
```

---

## 📜 License
MIT License. Free to use, adapt, and build upon for your own hackathon squad!
