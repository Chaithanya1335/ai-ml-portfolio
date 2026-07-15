const CONFIG = {
  github: "https://github.com/Chaithanya1335",
  linkedin: "https://linkedin.com/in/m-gnana-chaithanya",
};

document.querySelectorAll("#githubLink, #githubLink2").forEach(a => a.href = CONFIG.github);
document.querySelectorAll("#linkedinLink, #linkedinLink2").forEach(a => a.href = CONFIG.linkedin);
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Theme toggle =====
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
  });
}

// ===== Project cover styles (decorative category covers; swap in a real
// screenshot anytime by adding `image: "assets/projects/…"` to a project) =====
const COVERS = {
  rag:    { icon: "icon-brain",  label: "RAG · Retrieval",  grad: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)" },
  vision: { icon: "icon-eye",    label: "Vision · Medical", grad: "linear-gradient(135deg, #f472b6 0%, #818cf8 100%)" },
  agents: { icon: "icon-agents", label: "Agents",           grad: "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)" },
  mlops:  { icon: "icon-cloud",  label: "MLOps · Deploy",   grad: "linear-gradient(135deg, #818cf8 0%, #f472b6 100%)" },
};

// ===== Project data =====
const PROJECTS = [
  {
    title: "AdvRAG — Hybrid Vector + Keyword Retrieval",
    tags: ["rag"],
    cover: "rag",
    stack: "Python · LangChain · FAISS · ChromaDB · BM25 · OpenAI/Gemini Embeddings",
    desc: "Hybrid retriever fusing FAISS semantic search with BM25 keyword scoring via reciprocal rank fusion. Benchmarked chunking strategies across Hit Rate and MRR.",
    link: "https://github.com/Chaithanya1335",
  },
  {
    title: "MediConsult AI — Dual-Modality Medical Assistant",
    tags: ["vision", "rag"],
    cover: "vision",
    stack: "Python · LangChain · Groq LLaMA3 · FAISS · HuggingFace MiniLM · YOLOv8 · Streamlit",
    desc: "Semantic Q&A over a medical encyclopedia plus YOLOv8 visual skin-condition screening, with multilingual support. Deployed on Vercel/Render.",
    link: "https://github.com/Chaithanya1335/Medical_Chatbot",
  },
  {
    title: "TalentScout — Automated AI Recruitment Screener",
    tags: ["agents"],
    cover: "agents",
    stack: "Python · LangChain · Gemini · Pydantic · Streamlit",
    desc: "Parses resumes, scores candidate-to-JD fit, generates role-specific interview questions, and outputs a pass/fail decision — fully Pydantic-structured.",
    link: "https://github.com/Chaithanya1335/TalentScout",
  },
  {
    title: "NetworkSecurity — Phishing Detection, Full MLOps Stack",
    tags: ["mlops"],
    cover: "mlops",
    stack: "Python · MLflow · Docker · GitHub Actions CI/CD · AWS ECR/EC2 · FastAPI",
    desc: "Operationalised ML system with MLflow tracking, a model registry, containerised inference, and CI/CD auto-deploy to AWS on every merge to main.",
    link: "https://github.com/Chaithanya1335",
  },
];

const grid = document.getElementById("projectGrid");
function renderProjects(filter) {
  grid.innerHTML = "";
  PROJECTS.forEach(p => {
    const match = filter === "all" || p.tags.includes(filter);
    const card = document.createElement("div");
    card.className = "project-card reveal is-visible" + (match ? "" : " is-hidden");
    const liveLink = p.live
      ? `<a class="project-card__link project-card__link--live" href="${p.live}" target="_blank" rel="noopener" aria-label="Live demo">
          <svg width="14" height="14"><use href="#icon-arrow"/></svg>
        </a>`
      : "";
    const badge = p.badge ? `<span class="project-card__badge">${p.badge}</span>` : "";
    const cover = COVERS[p.cover] || COVERS.rag;
    const coverBody = p.image
      ? `<img class="project-card__cover-img" src="${p.image}" alt="${p.title} preview" loading="lazy">`
      : `<span class="project-card__cover-icon"><svg width="58" height="58"><use href="#${cover.icon}"/></svg></span>`;
    const coverClass = "project-card__cover" + (p.image ? " project-card__cover--img" : "");
    const coverStyle = p.image ? "" : ` style="background-image:${cover.grad}"`;
    card.innerHTML = `
      <div class="${coverClass}"${coverStyle}>
        ${coverBody}
        <span class="project-card__cover-label">${cover.label}</span>
      </div>
      <div class="project-card__body">
        <div class="project-card__head">
          <div>
            ${badge}
            <h3>${p.title}</h3>
          </div>
          <div class="project-card__actions">
            ${liveLink}
            <a class="project-card__link" href="${p.link}" target="_blank" rel="noopener" aria-label="View on GitHub">
              <svg width="16" height="16"><use href="#icon-github"/></svg>
            </a>
          </div>
        </div>
        <p>${p.desc}</p>
        <div class="tags">${p.stack.split(" · ").map(t => `<span>${t}</span>`).join("")}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}
renderProjects("all");

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderProjects(btn.dataset.filter);
});

// ===== Pathora featured gallery =====
const featuredMain = document.getElementById("featuredMainImg");
const featuredCaption = document.getElementById("featuredCaption");
const featuredThumbs = document.getElementById("featuredThumbs");
if (featuredThumbs && featuredMain) {
  featuredThumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest(".featured__thumb");
    if (!thumb) return;
    const { src, caption } = thumb.dataset;
    if (!src) return;
    featuredMain.style.opacity = "0.4";
    window.setTimeout(() => {
      featuredMain.src = src;
      featuredMain.alt = caption || "Pathora screenshot";
      if (featuredCaption) featuredCaption.textContent = caption || "";
      featuredMain.style.opacity = "1";
    }, 120);
    featuredThumbs.querySelectorAll(".featured__thumb").forEach((t) => t.classList.remove("is-active"));
    thumb.classList.add("is-active");
  });
}

// ===== Scroll state: nav bg, progress bar, back-to-top, scroll-spy =====
const nav = document.getElementById("nav");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const navLinkEls = Array.from(document.querySelectorAll(".nav__links a"));
const spySections = Array.from(document.querySelectorAll("main section[id]"))
  .filter(s => navLinkEls.some(a => a.getAttribute("href") === "#" + s.id));
const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 74;

let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  nav.classList.toggle("is-scrolled", y > 10);
  if (backToTop) backToTop.classList.toggle("is-visible", y > 500);
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${docH > 0 ? Math.min(y / docH, 1) : 0})`;

  // Scroll-spy: highlight the section currently in view
  if (spySections.length) {
    const threshold = y + navH + 40;
    let currentId = null; // nothing highlighted while still in the hero
    for (const s of spySections) {
      if (s.offsetTop <= threshold) currentId = s.id;
    }
    if (docH - y < 4) currentId = spySections[spySections.length - 1].id; // pin last at page bottom
    navLinkEls.forEach(a => {
      const active = a.getAttribute("href") === "#" + currentId;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();

// ===== Mobile nav toggle =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("is-open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("is-open")));

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ===== Scroll reveal =====
const revealItems = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(el => io.observe(el));

// ===== Animated stat counters =====
const counters = document.querySelectorAll("[data-count]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatCount(el, value) {
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  return prefix + Math.round(value).toLocaleString("en-US") + suffix;
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const duration = 1300;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = formatCount(el, target * eased);
    if (t < 1) window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);
}

if (counters.length) {
  if (prefersReducedMotion) {
    counters.forEach(el => { el.textContent = formatCount(el, parseFloat(el.dataset.count)); });
  } else {
    counters.forEach(el => { el.textContent = formatCount(el, 0); }); // reset before first paint
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countIO.observe(el));
  }
}
