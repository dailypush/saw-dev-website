const PROJECTS = {
  outlookcheck: {
    key: "outlookcheck",
    title: "Outlook Recipient Check",
    status: "Active",
    description:
      "A lightweight Outlook add-in that checks email recipients for potential mistakes. It flags mixed domains and detects similarly named contacts on different domains to avoid misdirected emails.",
    why: "Email mistakes can be costly. This add-in catches common errors before they happen by analyzing recipient patterns.",
    stack: "TypeScript, Outlook SDK",
    github: "https://github.com/Dailypush/OutlookRecipientCheck",
    demo: null,
    note: "Recently updated with enhanced recipient validation logic."
  },
  minecraftinglive: {
    key: "minecraftinglive",
    title: "Minecrafting Live",
    status: "Active",
    description:
      "A Docker and Git-based hosting solution for Minecraft-related technologies. Streamlines deployment and management of multiple Minecraft services.",
    why: "Managing Minecraft infrastructure manually is tedious. This project automates deployment and version control.",
    stack: "JavaScript, Docker, Git",
    github: "https://github.com/Dailypush/MinecraftingLive",
    demo: null,
    note: "Supports multiple service orchestration and automated backups."
  },
  gominecraft: {
    key: "gominecraft",
    title: "Go Minecraft Stat Stream",
    status: "Active",
    description:
      "Combines Minecraft, statistics, and real-time streaming of data. Provides live insights into Minecraft server metrics and player activity.",
    why: "Understanding server performance in real-time is crucial for managing a healthy Minecraft server.",
    stack: "Go, WebSocket, Minecraft API",
    github: "https://github.com/Dailypush/GoMinecraftStatStream",
    demo: null,
    note: "Features live monitoring dashboard with configurable metrics."
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
