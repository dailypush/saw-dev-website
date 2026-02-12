const PROJECTS = {
  twitchbot: {
    key: "twitchbot",
    title: "Twitch Bot",
    status: "Active Build",
    description:
      "A chat-first bot toolkit for stream commands, alerts, and timed mini-events.",
    why: "I wanted a clean bot playground where command logic is easy to test without a huge framework.",
    stack: "Node.js, Twitch API, WebSocket events",
    github: "https://github.com/yourname/twitchbot",
    demo: "https://example.com/twitchbot",
    note: "Next step: split moderation commands into plugins so each stream can load only what it needs."
  },
  candy: {
    key: "candy",
    title: "Candy Machine",
    status: "Prototype",
    description:
      "A goofy generator that remixes color palettes and names into fake candy brands.",
    why: "It started as a design warmup and turned into a fast way to test token systems.",
    stack: "Vanilla JS, CSS custom properties, static JSON",
    github: "https://github.com/yourname/candy-machine",
    demo: "https://example.com/candy",
    note: "Needs a small persistence layer for saved favorites and local export."
  },
  overlay: {
    key: "overlay",
    title: "Stream Overlay Lab",
    status: "In Progress",
    description:
      "Browser-source overlays with scene toggles, score widgets, and low-latency animation hooks.",
    why: "I wanted full control over overlay timing instead of hardcoding scenes in OBS every time.",
    stack: "TypeScript, Canvas API, OBS browser source",
    github: "https://github.com/yourname/overlay-lab",
    demo: "https://example.com/overlay",
    note: "Experimenting with a tiny event bus so widgets can sync without coupling."
  }
};

const bootScreen = document.getElementById("boot-screen");
const bootOutput = document.getElementById("boot-output");
const progressWrap = document.getElementById("progress-wrap");
const progressBar = document.getElementById("progress-bar");
const asciiLogo = document.getElementById("ascii-logo");
const bladeReveal = document.getElementById("blade-reveal");

const terminalHeader = document.getElementById("terminal-header");
const terminalForm = document.getElementById("terminal-form");
const terminalInput = document.getElementById("terminal-input");
const terminalFeedback = document.getElementById("terminal-feedback");

const playground = document.getElementById("playground");
const projectGrid = document.getElementById("project-grid");
const funBuilds = document.getElementById("fun-builds");

const panel = document.getElementById("project-panel");
const panelBackdrop = document.getElementById("panel-backdrop");
const panelClose = document.getElementById("panel-close");
const panelStatus = document.getElementById("panel-status");
const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const panelWhy = document.getElementById("panel-why");
const panelStack = document.getElementById("panel-stack");
const panelGithub = document.getElementById("panel-github");
const panelDemo = document.getElementById("panel-demo");
const panelNote = document.getElementById("panel-note");

const bootLines = [
  "$ ./launch playground",
  "[saw-core] loading runtime...",
  "[modules] resolving fun builds index...",
  "[net] loopback OK, external links deferred",
  "[ui] terminal channel online",
  "[ready] handoff to interactive mode"
];

const ascii = String.raw`
          .-^-.
      _.-' /|\\ '--._
   .-'    /_|_\\     '-.
  /____.-' / \\ '-._____\\
  \\_____.-\_/_-.___ ____/
         SAW.DEV
`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBootSequence() {
  for (const line of bootLines) {
    bootOutput.textContent += `${line}\n`;
    await wait(280);
  }

  progressWrap.classList.remove("hidden");
  await wait(120);
  progressBar.style.width = "100%";
  await wait(1250);

  asciiLogo.textContent = ascii;
  asciiLogo.classList.remove("hidden");

  await wait(650);
  bladeReveal.classList.remove("hidden");
  await wait(1180);

  bootScreen.classList.add("hidden");
  terminalHeader.classList.remove("hidden");
  playground.classList.remove("hidden");
  terminalInput.focus();
}

function renderProjectCards() {
  projectGrid.innerHTML = Object.values(PROJECTS)
    .map(
      (p) => `
      <article class="project-card">
        <span class="card-key">${p.key}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="card-actions">
          <button class="card-open" data-key="${p.key}" type="button">Open details</button>
        </div>
      </article>
    `
    )
    .join("");
}

function feedback(message) {
  terminalFeedback.textContent = message;
}

function scrollToEl(el) {
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openPanel(key) {
  const project = PROJECTS[key?.toLowerCase()];
  if (!project) {
    feedback(`No project found for "${key}". Try: open twitchbot`);
    return;
  }

  panelStatus.textContent = project.status;
  panelTitle.textContent = project.title;
  panelDescription.textContent = project.description;
  panelWhy.textContent = project.why;
  panelStack.textContent = project.stack;
  panelGithub.href = project.github;
  panelDemo.href = project.demo;
  panelNote.textContent = project.note;

  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("open");
  panelBackdrop.hidden = false;
  requestAnimationFrame(() => panelBackdrop.classList.add("visible"));
  feedback(`Opened ${project.key} in the right panel.`);
}

function closePanel() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  panelBackdrop.classList.remove("visible");
  setTimeout(() => {
    if (!panel.classList.contains("open")) {
      panelBackdrop.hidden = true;
    }
  }, 240);
}

function handleCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return;
  }

  const lower = input.toLowerCase();

  if (lower === "help") {
    feedback("Commands: help, fun, playground, open <key>, clear, sudo make fun");
    return;
  }

  if (lower === "fun") {
    scrollToEl(funBuilds);
    feedback("Jumped to Fun Builds.");
    return;
  }

  if (lower === "playground") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    feedback("Moved to top of playground.");
    return;
  }

  if (lower === "clear") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    terminalFeedback.textContent = "";
    terminalInput.value = "";
    return;
  }

  if (lower === "sudo make fun") {
    feedback("Permission granted. Injecting 12% more chaos into the build queue.");
    return;
  }

  if (lower.startsWith("open ")) {
    const key = input.slice(5).trim();
    if (!key) {
      feedback("Usage: open <key>  (example: open overlay)");
      return;
    }
    openPanel(key);
    return;
  }

  feedback(`Unknown command: "${input}". Try "help" for available commands.`);
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleCommand(terminalInput.value);
});

projectGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".card-open");
  if (!button) {
    return;
  }
  openPanel(button.dataset.key);
});

panelClose.addEventListener("click", closePanel);
panelBackdrop.addEventListener("click", closePanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && panel.classList.contains("open")) {
    closePanel();
  }
});

renderProjectCards();
runBootSequence();
