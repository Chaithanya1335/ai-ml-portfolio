const CONFIG = {
  github: "https://github.com/Chaithanya1335",
  linkedin: "https://linkedin.com/in/m-gnana-chaithanya",
};

document.querySelectorAll("#githubLink, #githubLink2").forEach(a => a.href = CONFIG.github);
document.querySelectorAll("#linkedinLink, #linkedinLink2").forEach(a => a.href = CONFIG.linkedin);
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Project data =====
const PROJECTS = [
  {
    title: "AdvRAG — Hybrid Vector + Keyword Retrieval",
    tags: ["rag"],
    stack: "Python · LangChain · FAISS · ChromaDB · BM25 · OpenAI/Gemini Embeddings",
    desc: "Hybrid retriever fusing FAISS semantic search with BM25 keyword scoring via reciprocal rank fusion. Benchmarked chunking strategies across Hit Rate and MRR.",
    link: "https://github.com/Chaithanya1335",
  },
  {
    title: "MediConsult AI — Dual-Modality Medical Assistant",
    tags: ["vision", "rag"],
    stack: "Python · LangChain · Groq LLaMA3 · FAISS · HuggingFace MiniLM · YOLOv8 · Streamlit",
    desc: "Semantic Q&A over a medical encyclopedia plus YOLOv8 visual skin-condition screening, with multilingual support. Deployed on Vercel/Render.",
    link: "https://github.com/Chaithanya1335/Medical_Chatbot",
  },
  {
    title: "TalentScout — Automated AI Recruitment Screener",
    tags: ["agents"],
    stack: "Python · LangChain · Gemini · Pydantic · Streamlit",
    desc: "Parses resumes, scores candidate-to-JD fit, generates role-specific interview questions, and outputs a pass/fail decision — fully Pydantic-structured.",
    link: "https://github.com/Chaithanya1335/TalentScout",
  },
  {
    title: "NetworkSecurity — Phishing Detection, Full MLOps Stack",
    tags: ["mlops"],
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
    card.innerHTML = `
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

// ===== Nav scroll state + mobile toggle =====
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
  document.getElementById("backToTop").classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("is-open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("is-open")));

document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

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
