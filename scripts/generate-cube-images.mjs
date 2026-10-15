import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "cube");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const SOURCES = [
  { id: "beming", file: "public/Reference photos/Frame 28.png" },
  { id: "ceramics", file: "public/Reference photos/Frame 29.png" },
  { id: "beauty", file: "public/Reference photos/Frame 49.jpg" },
  { id: "brownwood", file: "public/Reference photos/Frame 166 (1).png" },
  { id: "desk-night", file: "public/Reference photos/frame-259-night-desk.png" },
  { id: "desk-white", file: "public/Reference photos/frame-259-white-desk.png" },
  { id: "lilili-home", file: "public/Reference photos/lilili-home-office.png" },
  { id: "lilili-study", file: "public/Reference photos/lilili-study-desk.png" },
  { id: "lilili-white", file: "public/Reference photos/lilili-white-desk.png" },
  { id: "oak-detail", file: "public/Reference photos/product-detail-oak-desk.png" },
  { id: "kitchen", file: "public/Reference photos/a-kitchen-bench.png" },
  { id: "icespace", file: "public/Reference photos/lll.png" },
  { id: "caremate-home", file: "public/Reference photos/Home page.png" },
  { id: "ai-assistant", file: "public/Reference photos/AI assistant.png" },
  { id: "chats", file: "public/Reference photos/chats.png" },
  { id: "audio-call", file: "public/Reference photos/Audio call.png" },
  { id: "sos", file: "public/Reference photos/SOS page.png" },
  { id: "splash-dark", file: "public/Reference photos/Splash Screen 6.png" },
  { id: "splash-landscape", file: "public/Reference photos/Splash Screen 7-landscape 1.png" },
  { id: "offline", file: "public/Reference photos/Offline screen.png" },
  { id: "emergency-contact", file: "public/Reference photos/Add emergency contact.png" },
  { id: "aeva-lip", file: "public/Reference photos/2c523fe8-1992-4a29-8a35-3bb81f4ca28b.jpg" },
  { id: "aeva-laptop", file: "public/Reference photos/d694b150-df0e-4722-9ca3-33ae9c982768.png" },
  { id: "aeva-logo", file: "public/Reference photos/AEVA.png" },
  { id: "proleap", file: "public/Reference photos/proleap.png" },
  { id: "milk-shake", file: "public/images/projects/05-milk-shake.png" },
  { id: "leaf", file: "public/images/projects/07-leaf.png" },
  { id: "camullch", file: "public/images/projects/08-camullch.png" },
  { id: "worldlink", file: "public/images/projects/09-worldlink.png" },
  { id: "caremate-app", file: "public/images/projects/02-caremate-app.png" },
  { id: "caremate-blue", file: "public/images/projects/03-caremate.png" },
  { id: "lia-clay", file: "public/images/projects/04-lia-clay.png" },
  { id: "beming-tile", file: "public/images/projects/01-beming.png" },
  { id: "brownwood-tile", file: "public/images/projects/06-brownwood.png" },
];

async function main() {
  console.log(`Processing ${SOURCES.length} source images...`);
  for (const src of SOURCES) {
    const inPath = path.join(ROOT, src.file);
    const outPath = path.join(OUT_DIR, `${src.id}.webp`);
    try {
      await sharp(inPath)
        .resize(256, 256, { fit: "cover", position: "center" })
        .webp({ quality: 88 })
        .toFile(outPath);
      console.log(`✓ Generated ${src.id}.webp`);
    } catch (err) {
      console.error(`✗ Error processing ${src.file}:`, err.message);
    }
  }
  console.log("Done generating cube images!");
}

main();
