const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const ROOT = path.resolve(__dirname, "..");
const DOWNLOADS_DIR = path.join(ROOT, "downloads");

function isComponentFolder(name) {
  return /^mwg_(free_\d+|\d+)$/.test(name);
}

function shouldSkipEntry(name) {
  return name.startsWith(".") || name === ".DS_Store";
}

function listComponentIds() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isComponentFolder(entry.name))
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(ROOT, id, "index.html")))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function zipComponent(id) {
  const componentPath = path.join(ROOT, id);
  const outputPath = path.join(DOWNLOADS_DIR, `${id}.zip`);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve({ id, bytes: archive.pointer() }));
    output.on("error", reject);
    archive.on("error", reject);

    archive.pipe(output);
    archive.glob("**/*", {
      cwd: componentPath,
      ignore: ["**/.DS_Store", "**/.*"],
    });
    archive.finalize();
  });
}

async function main() {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

  const ids = listComponentIds();
  let totalBytes = 0;

  for (const id of ids) {
    const result = await zipComponent(id);
    totalBytes += result.bytes;
    console.log(`Packed ${id}.zip (${Math.round(result.bytes / 1024)} KB)`);
  }

  console.log(`Generated ${ids.length} downloads (${Math.round(totalBytes / 1024 / 1024)} MB total).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
