import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const outDir = path.join(ROOT, "public", "images", "cube");

const CUBE_FACES = [
  // Face 0: Right (+X)
  ['milk-shake', 'lilili-home', 'chats', 'leaf', 'splash-dark', 'desk-night', 'camullch', 'audio-call', 'worldlink'],
  // Face 1: Left (-X)
  ['aeva-laptop', 'caremate-app', 'lilili-white', 'beauty', 'splash-landscape', 'caremate-blue', 'ceramics', 'emergency-contact', 'oak-detail'],
  // Face 2: Top (+Y)
  ['desk-night', 'lia-clay', 'milk-shake', 'ai-assistant', 'icespace', 'camullch', 'beming', 'aeva-logo', 'leaf'],
  // Face 3: Bottom (-Y)
  ['lilili-home', 'brownwood', 'caremate-home', 'aeva-lip', 'chats', 'kitchen', 'splash-dark', 'proleap', 'beauty'],
  // Face 4: Front (+Z)
  ['beming', 'ai-assistant', 'oak-detail', 'beauty', 'icespace', 'brownwood', 'caremate-home', 'ceramics', 'proleap'],
  // Face 5: Back (-Z)
  ['aeva-lip', 'kitchen', 'sos', 'beming-tile', 'lilili-study', 'offline', 'lia-clay', 'desk-white', 'brownwood-tile']
];

async function buildFaces() {
  const SIZE = 768;
  const PAD = 24;
  const GAP = 18;
  const CELL = 228;

  // Mask for rounded corners on each tile
  const maskSvg = Buffer.from(
    `<svg width="${CELL}" height="${CELL}"><rect x="0" y="0" width="${CELL}" height="${CELL}" rx="14" ry="14" fill="#fff"/></svg>`
  );

  for (let faceIdx = 0; faceIdx < 6; faceIdx++) {
    const tiles = CUBE_FACES[faceIdx];
    const composites = [];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const id = tiles[row * 3 + col];
        const srcPath = path.join(outDir, `${id}.webp`);
        if (!fs.existsSync(srcPath)) {
          console.warn(`Missing tile: ${srcPath}`);
          continue;
        }

        const left = PAD + col * (CELL + GAP);
        const top = PAD + row * (CELL + GAP);

        // Resize and apply rounded mask
        const cellBuf = await sharp(srcPath)
          .resize(CELL, CELL, { fit: "cover" })
          .composite([{ input: maskSvg, blend: "dest-in" }])
          .png()
          .toBuffer();

        composites.push({ input: cellBuf, left, top });
      }
    }

    // Base chassis: dark grey/black background
    await sharp({
      create: {
        width: SIZE,
        height: SIZE,
        channels: 4,
        background: { r: 14, g: 15, b: 10, alpha: 1 }
      }
    })
      .composite(composites)
      .webp({ quality: 90 })
      .toFile(path.join(outDir, `face-${faceIdx}.webp`));

    console.log(`✓ Generated face-${faceIdx}.webp`);
  }
}

buildFaces().catch(console.error);
