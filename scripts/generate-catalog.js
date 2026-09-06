const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

function isComponentFolder(name) {
  return /^mwg_(free_\d+|\d+)$/.test(name);
}

function findThumbnail(componentPath) {
  const mediasDir = path.join(componentPath, "assets", "medias");
  if (!fs.existsSync(mediasDir)) return null;

  const files = fs
    .readdirSync(mediasDir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) return null;
  return `${path.basename(componentPath)}/assets/medias/${files[0]}`;
}

function formatLabel(id) {
  if (id.startsWith("mwg_free_")) {
    return `Free ${id.replace("mwg_free_", "")}`;
  }
  return id.replace("mwg_", "MWG ");
}

function sortComponents(a, b) {
  const aFree = a.id.includes("free");
  const bFree = b.id.includes("free");
  if (aFree !== bFree) return aFree ? -1 : 1;

  const aNum = parseInt(a.id.replace(/\D/g, ""), 10);
  const bNum = parseInt(b.id.replace(/\D/g, ""), 10);
  return aNum - bNum;
}

function scanComponents() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isComponentFolder(entry.name))
    .map((entry) => {
      const id = entry.name;
      const componentPath = path.join(ROOT, id);
      const hasDemo = fs.existsSync(path.join(componentPath, "index.html"));

      return {
        id,
        label: formatLabel(id),
        path: `${id}/index.html`,
        download: `downloads/${id}.zip`,
        thumbnail: findThumbnail(componentPath),
        isFree: id.startsWith("mwg_free_"),
        hasDemo,
      };
    })
    .filter((component) => component.hasDemo)
    .sort(sortComponents);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCard(component) {
  const thumbnail = component.thumbnail
    ? `<img src="${escapeHtml(component.thumbnail)}" alt="" loading="lazy" />`
    : `<div class="card-fallback" aria-hidden="true">${escapeHtml(component.label)}</div>`;

  const badge = component.isFree ? `<span class="badge">Free</span>` : "";

  return `
    <article class="card" data-id="${escapeHtml(component.id)}" data-label="${escapeHtml(component.label.toLowerCase())}">
      <div class="card-media">
        ${thumbnail}
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h2>${escapeHtml(component.label)}</h2>
          ${badge}
        </div>
        <div class="card-actions">
          <a class="card-link" href="${escapeHtml(component.path)}" target="_blank" rel="noopener noreferrer">
            Open demo
            <span aria-hidden="true">↗</span>
          </a>
          <a class="card-link card-link--download" href="${escapeHtml(component.download)}" download="${escapeHtml(component.id)}.zip">
            Download
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </article>`;
}

function renderIndex(components) {
  const cards = components.map(renderCard).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Vault — Carthagos</title>
  <meta name="description" content="Gallery of GSAP effects (Made With GSAP) ready for preview and download.">
  <style>
    @font-face {
      font-family: "PP Neue Montreal";
      src: url("assets/brand/PPNeueMontreal-Regular.ttf") format("truetype");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: "PP Neue Montreal";
      src: url("assets/brand/PPNeueMontreal-Bold.ttf") format("truetype");
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: "Exposure";
      src: url("assets/brand/ExposureItalicTrial.otf") format("opentype");
      font-weight: 400;
      font-style: italic;
      font-display: swap;
    }

    :root {
      color-scheme: dark;
      --dark: #282828;
      --navy: #101B32;
      --accent: #FE4004;
      --blue: #9FD5F3;
      --text-light: #C9D5DB;
      --text-body: #3A3A3A;
      --text-muted: #7A8B94;
      --white: #FFFFFF;
      --cover-bg: #1A1E2E;
      --surface: rgba(255, 255, 255, 0.04);
      --surface-hover: rgba(255, 255, 255, 0.07);
      --border: rgba(201, 213, 219, 0.12);
      --accent-soft: rgba(254, 64, 4, 0.14);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: "PP Neue Montreal", ui-sans-serif, system-ui, sans-serif;
      background: var(--navy);
      color: var(--white);
    }

    .hero-bg {
      position: absolute;
      inset: 0 0 auto 0;
      height: 520px;
      overflow: hidden;
      pointer-events: none;
    }

    .hero-bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.42;
    }

    .hero-bg::after {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(16, 27, 50, 0.15) 0%, rgba(16, 27, 50, 0.88) 72%, var(--navy) 100%);
    }

    .page {
      position: relative;
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 40px 0 80px;
    }

    .site-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 56px;
    }

    .site-header img {
      width: 60px;
      height: auto;
      display: block;
    }

    .site-header span {
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-light);
    }

    .hero {
      display: grid;
      gap: 20px;
      max-width: 720px;
      margin-bottom: 48px;
    }

    .eyebrow {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--blue);
    }

    h1 {
      margin: 0;
      font-family: Exposure, "Times New Roman", serif;
      font-size: clamp(2.75rem, 6vw, 4.5rem);
      font-weight: 400;
      font-style: italic;
      line-height: 0.95;
      letter-spacing: -0.02em;
      color: var(--white);
    }

    .hero-copy {
      margin: 0;
      max-width: 560px;
      color: var(--text-light);
      font-size: 1.05rem;
      line-height: 1.65;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .search {
      flex: 1 1 280px;
      position: relative;
    }

    .search input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 0;
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent);
      background: var(--cover-bg);
      color: var(--white);
      font: inherit;
      outline: none;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .search input::placeholder {
      color: var(--text-muted);
    }

    .search input:focus {
      border-color: var(--accent);
      background: rgba(26, 30, 46, 0.95);
    }

    .count {
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .count span {
      color: var(--accent);
      font-weight: 700;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    .card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 0;
      background: var(--cover-bg);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      transform: translateY(-3px);
      border-color: rgba(254, 64, 4, 0.45);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
    }

    .card-media {
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background:
        linear-gradient(135deg, rgba(254, 64, 4, 0.18), rgba(159, 213, 243, 0.08)),
        var(--dark);
      border-bottom: 1px solid var(--border);
    }

    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease;
    }

    .card:hover .card-media img {
      transform: scale(1.03);
    }

    .card-fallback {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-light);
    }

    .card-body {
      display: grid;
      gap: 18px;
      padding: 20px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--accent);
    }

    .card h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--accent);
    }

    .badge {
      padding: 4px 10px;
      border-radius: 0;
      background: var(--accent-soft);
      color: var(--accent);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding-top: 4px;
    }

    .card-link {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border: 1px solid var(--border);
      color: var(--text-light);
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .card-link:hover {
      color: var(--accent);
      border-color: rgba(254, 64, 4, 0.45);
    }

    .card-link--download {
      background: var(--accent-soft);
      border-color: rgba(254, 64, 4, 0.35);
      color: var(--accent);
    }

    .card-link--download:hover {
      background: rgba(254, 64, 4, 0.22);
      color: var(--white);
    }

    .empty {
      display: none;
      padding: 56px 24px;
      text-align: center;
      color: var(--text-muted);
      border: 1px dashed var(--border);
      border-left: 3px solid var(--accent);
      background: var(--cover-bg);
    }

    .empty.visible {
      display: block;
    }

    .site-footer {
      margin-top: 72px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      color: var(--text-muted);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @media (max-width: 640px) {
      .page {
        width: min(100%, calc(100% - 24px));
        padding-top: 24px;
      }

      .toolbar,
      .site-header,
      .site-footer {
        align-items: stretch;
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="hero-bg" aria-hidden="true">
    <img src="assets/brand/cover-bg-clean.png" alt="">
  </div>

  <main class="page">
    <header class="site-header">
      <img src="assets/brand/crt-logo-orange.png" alt="Carthagos">
      <span>Component Vault</span>
    </header>

    <section class="hero">
      <p class="eyebrow">Made With GSAP</p>
      <h1>Component Vault</h1>
      <p class="hero-copy">
        A gallery of GSAP effects ready for preview. Each demo opens full-screen to preserve scroll and interactions.
      </p>
    </section>

    <section class="toolbar" aria-label="Gallery filters">
      <label class="search">
        <span class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Search components</span>
        <input id="search" type="search" placeholder="Search by MWG 051, free, etc." autocomplete="off">
      </label>
      <p class="count"><span id="visible-count">${components.length}</span> of ${components.length} components</p>
    </section>

    <section id="grid" class="grid">
      ${cards}
    </section>

    <p id="empty" class="empty">No components found for this search.</p>

    <footer class="site-footer">
      <span>Carthagos Design System</span>
      <span>GSAP Effects Library</span>
    </footer>
  </main>

  <script>
    const searchInput = document.getElementById("search");
    const cards = Array.from(document.querySelectorAll(".card"));
    const visibleCount = document.getElementById("visible-count");
    const emptyState = document.getElementById("empty");

    function normalize(value) {
      return value.toLowerCase().trim();
    }

    function filterCards() {
      const query = normalize(searchInput.value);
      let visible = 0;

      cards.forEach((card) => {
        const id = normalize(card.dataset.id || "");
        const label = normalize(card.dataset.label || "");
        const matches = !query || id.includes(query) || label.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      visibleCount.textContent = String(visible);
      emptyState.classList.toggle("visible", visible === 0);
    }

    searchInput.addEventListener("input", filterCards);
  </script>
</body>
</html>`;
}

function main() {
  const components = scanComponents();
  const componentsJsonPath = path.join(ROOT, "components.json");
  const indexHtmlPath = path.join(ROOT, "index.html");

  fs.writeFileSync(componentsJsonPath, `${JSON.stringify(components, null, 2)}\n`);
  fs.writeFileSync(indexHtmlPath, renderIndex(components));

  console.log(`Generated catalog for ${components.length} components.`);
}

main();
