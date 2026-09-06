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
        <a class="card-link" href="${escapeHtml(component.path)}" target="_blank" rel="noopener noreferrer">
          Abrir demo
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>`;
}

function renderIndex(components) {
  const cards = components.map(renderCard).join("\n");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Vault</title>
  <meta name="description" content="Galeria de efeitos GSAP (Made With GSAP) prontos para preview e uso.">
  <style>
    :root {
      color-scheme: dark;
      --bg: #05060a;
      --surface: #0d1017;
      --surface-hover: #141925;
      --border: rgba(255, 255, 255, 0.08);
      --text: #f5f7fb;
      --muted: rgba(245, 247, 251, 0.55);
      --accent: #7c5cff;
      --accent-soft: rgba(124, 92, 255, 0.16);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top, rgba(124, 92, 255, 0.12), transparent 32%),
        var(--bg);
      color: var(--text);
    }

    .page {
      width: min(1200px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0 72px;
    }

    .hero {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .eyebrow {
      margin: 0;
      font-size: 12px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--muted);
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3.5rem);
      line-height: 1.05;
      letter-spacing: -0.04em;
    }

    .hero-copy {
      margin: 0;
      max-width: 640px;
      color: var(--muted);
      line-height: 1.6;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .search {
      flex: 1 1 280px;
      position: relative;
    }

    .search input {
      width: 100%;
      padding: 14px 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      font: inherit;
      outline: none;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .search input:focus {
      border-color: rgba(124, 92, 255, 0.55);
      background: #111522;
    }

    .count {
      font-size: 14px;
      color: var(--muted);
      white-space: nowrap;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }

    .card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--surface);
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(124, 92, 255, 0.35);
      background: var(--surface-hover);
    }

    .card-media {
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(124, 92, 255, 0.18), rgba(255, 255, 255, 0.03));
      border-bottom: 1px solid var(--border);
    }

    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-fallback {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 14px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.72);
    }

    .card-body {
      display: grid;
      gap: 16px;
      padding: 18px;
    }

    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .card h2 {
      margin: 0;
      font-size: 1rem;
      letter-spacing: 0.02em;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: #cbbcff;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .card-link {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      text-decoration: none;
      font-size: 14px;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .card-link:hover {
      background: var(--accent-soft);
      color: #efe9ff;
    }

    .empty {
      display: none;
      padding: 48px 24px;
      text-align: center;
      color: var(--muted);
      border: 1px dashed var(--border);
      border-radius: 20px;
    }

    .empty.visible {
      display: block;
    }

    @media (max-width: 640px) {
      .page {
        width: min(100%, calc(100% - 24px));
        padding-top: 32px;
      }

      .toolbar {
        align-items: stretch;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <p class="eyebrow">Made With GSAP</p>
      <h1>Component Vault</h1>
      <p class="hero-copy">
        Galeria de efeitos GSAP prontos para preview. Cada demo abre em tela cheia para preservar scroll e interações.
      </p>
    </header>

    <section class="toolbar" aria-label="Filtros da galeria">
      <label class="search">
        <span class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Buscar componente</span>
        <input id="search" type="search" placeholder="Buscar por MWG 051, free, etc." autocomplete="off">
      </label>
      <p class="count"><span id="visible-count">${components.length}</span> de ${components.length} componentes</p>
    </section>

    <section id="grid" class="grid">
      ${cards}
    </section>

    <p id="empty" class="empty">Nenhum componente encontrado para essa busca.</p>
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
