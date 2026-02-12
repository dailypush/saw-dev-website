const PROJECT_DATA_SOURCE = {
  endpoint: "assets/projects.json",
  label: "workflow sync"
};

const LOCAL_PROJECTS = {
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

let projects = { ...LOCAL_PROJECTS };
let lastPanelTrigger = null;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
const projectSource = document.getElementById("project-source");
const projectKeys = document.getElementById("project-keys");
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

function smoothBehavior() {
  return prefersReducedMotion ? "auto" : "smooth";
}

function updateProjectMeta(sourceLabel) {
  const keys = Object.keys(projects);
  projectSource.textContent = `Source: ${sourceLabel}`;
  projectKeys.innerHTML = `Keys: ${keys.map((key) => `<code>${key}</code>`).join(", ")}`;
}

function renderProjectCards() {
  const allProjects = Object.values(projects);
  if (allProjects.length === 0) {
    projectGrid.innerHTML = "<p>No projects available yet.</p>";
    return;
  }

  projectGrid.innerHTML = allProjects
    .map(
      (p) => `
      <article class="project-card">
        <span class="card-key">${p.key}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="card-actions">
          <button
            class="card-open"
            data-key="${p.key}"
            type="button"
            aria-haspopup="dialog"
            aria-controls="project-panel"
            aria-label="Open details for ${p.title}"
          >
            Open details
          </button>
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
  el.scrollIntoView({ behavior: smoothBehavior(), block: "start" });
}

function setLinkState(anchor, href) {
  if (href) {
    anchor.href = href;
    anchor.removeAttribute("aria-disabled");
    anchor.tabIndex = 0;
  } else {
    anchor.href = "#";
    anchor.setAttribute("aria-disabled", "true");
    anchor.tabIndex = -1;
  }
}

function openPanel(key, triggerEl) {
  const project = projects[key?.toLowerCase()];
  if (!project) {
    const firstKey = Object.keys(projects)[0] || "help";
    feedback(`No project found for "${key}". Try: open ${firstKey}`);
    return;
  }

  lastPanelTrigger = triggerEl || document.activeElement;

  panelStatus.textContent = project.status;
  panelTitle.textContent = project.title;
  panelDescription.textContent = project.description;
  panelWhy.textContent = project.why;
  panelStack.textContent = project.stack;
  setLinkState(panelGithub, project.github);
  setLinkState(panelDemo, project.demo);
  panelNote.textContent = project.note;

  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("open");
  panelBackdrop.hidden = false;
  requestAnimationFrame(() => panelBackdrop.classList.add("visible"));
  panelClose.focus();
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

  if (lastPanelTrigger && typeof lastPanelTrigger.focus === "function") {
    lastPanelTrigger.focus();
  }
}

function trapPanelFocus(event) {
  if (!panel.classList.contains("open") || event.key !== "Tab") {
    return;
  }

  const focusables = panel.querySelectorAll(
    "button, [href]:not([aria-disabled='true']), input, select, textarea, [tabindex]:not([tabindex='-1'])"
  );

  if (focusables.length === 0) {
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function normalizeProjectRecord(rawProject) {
  const key = String(rawProject.key || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!key) {
    return null;
  }

  const local = LOCAL_PROJECTS[key] || {};
  return {
    key,
    title: local.title || rawProject.title || key,
    status: local.status || rawProject.status || "Active",
    description: local.description || rawProject.description || "Public project.",
    why: local.why || rawProject.why || "Synced from repository metadata.",
    stack: local.stack || rawProject.stack || "Not specified",
    github: local.github || rawProject.github || null,
    demo: local.demo || rawProject.demo || null,
    note: local.note || rawProject.note || "Metadata updated by workflow sync."
  };
}

function useLocalProjects(sourceLabel, message) {
  projects = { ...LOCAL_PROJECTS };
  updateProjectMeta(sourceLabel);
  renderProjectCards();
  if (message) {
    feedback(message);
  }
}

async function loadProjectsFromStaticData(showStatus = false) {
  if (showStatus) {
    feedback("Reloading projects from workflow data...");
  }

  try {
    const response = await fetch(`${PROJECT_DATA_SOURCE.endpoint}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Data file unavailable (${response.status})`);
    }

    const payload = await response.json();
    const incoming = Array.isArray(payload) ? payload : payload.projects;
    if (!Array.isArray(incoming) || incoming.length === 0) {
      throw new Error("No projects in data payload.");
    }

    const normalized = incoming.map(normalizeProjectRecord).filter(Boolean);
    if (!normalized.length) {
      throw new Error("No valid projects after normalization.");
    }

    projects = Object.fromEntries(normalized.map((project) => [project.key, project]));
    const generatedAt = payload && payload.generated_at ? ` (${payload.generated_at})` : "";
    const sourceLabel = payload && payload.source ? `${payload.source}${generatedAt}` : PROJECT_DATA_SOURCE.label;
    updateProjectMeta(sourceLabel);
    renderProjectCards();

    if (showStatus) {
      feedback(`Loaded ${normalized.length} project(s) from workflow data.`);
    }
  } catch {
    useLocalProjects("local fallback", showStatus ? "Using local project data (workflow file unavailable)." : "");
  }
}

async function typeLaunchLine() {
  bootOutput.textContent = "$ ";
  const command = "./launch playground";

  if (prefersReducedMotion) {
    bootOutput.textContent += `${command}\n`;
    return;
  }

  for (const char of command) {
    bootOutput.textContent += char;
    await wait(40);
  }

  bootOutput.textContent += "\n";
}

async function runBootSequence() {
  await typeLaunchLine();

  const lineDelay = prefersReducedMotion ? 0 : 240;
  for (const line of bootLines) {
    bootOutput.textContent += `${line}\n`;
    if (lineDelay) {
      await wait(lineDelay);
    }
  }

  progressWrap.classList.remove("hidden");
  if (!prefersReducedMotion) {
    await wait(120);
  }

  progressBar.style.width = "100%";
  if (!prefersReducedMotion) {
    await wait(1200);
  }

  asciiLogo.textContent = ascii;
  asciiLogo.classList.remove("hidden");

  if (!prefersReducedMotion) {
    await wait(500);
    bladeReveal.classList.remove("hidden");
    await wait(1180);
  }

  bootScreen.classList.add("hidden");
  terminalHeader.classList.remove("hidden");
  playground.classList.remove("hidden");
  terminalInput.focus();
}

function handleCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return;
  }

  const lower = input.toLowerCase();

  if (lower === "help") {
    feedback("Commands: help, fun, playground, open <key>, repos, clear, sudo make fun");
    return;
  }

  if (lower === "fun") {
    scrollToEl(funBuilds);
    feedback("Jumped to Projects.");
    return;
  }

  if (lower === "playground") {
    window.scrollTo({ top: 0, behavior: smoothBehavior() });
    feedback("Moved to top of playground.");
    return;
  }

  if (lower === "repos") {
    loadProjectsFromStaticData(true);
    return;
  }

  if (lower === "clear") {
    window.scrollTo({ top: 0, behavior: smoothBehavior() });
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
      feedback("Usage: open <key>  (example: open outlookcheck)");
      return;
    }
    openPanel(key, terminalInput);
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

  openPanel(button.dataset.key, button);
});

panelClose.addEventListener("click", closePanel);
panelBackdrop.addEventListener("click", closePanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && panel.classList.contains("open")) {
    closePanel();
    return;
  }

  trapPanelFocus(event);
});

updateProjectMeta("local data");
renderProjectCards();
loadProjectsFromStaticData(false);
runBootSequence();
