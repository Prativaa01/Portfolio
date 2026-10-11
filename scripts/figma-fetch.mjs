#!/usr/bin/env node
/**
 * Fetch a Figma file's JSON via the REST API and cache it locally.
 *
 * Why this exists: Figma's official MCP server is gated behind a paid Dev
 * Mode seat and rejects dynamic client registration for unlisted MCP clients,
 * so the REST API on a free plan is the practical route.
 *
 * The token is prompted for interactively and used only in memory. It is never
 * written to disk and never passed as a CLI argument (which would leak it into
 * shell history).
 *
 * Usage:
 *   node scripts/figma-fetch.mjs <FILE_KEY>
 *   node scripts/figma-fetch.mjs --force <FILE_KEY>   bypass the cache
 */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "design");
const OUT_FILE = join(OUT_DIR, "figma-export.json");

/** Pull the key out of a full Figma URL, or accept a bare key. */
function parseFileKey(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Handles both /design/<key>/... and /file/<key>/... and /board/<key>/...
  const urlMatch = trimmed.match(/figma\.com\/(?:design|file|board|proto)\/([A-Za-z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];

  // Bare key: Figma file keys are URL-safe base64-ish, no dots or slashes.
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) return trimmed;

  return null;
}

function prompt(question) {
  // Non-interactive shells (CI, piped input) would otherwise hang or exit
  // silently with no diagnostic, so refuse up front.
  if (!stdin.isTTY) {
    throw new Error(
      "No interactive terminal detected - the token has to be typed in.\n" +
        "Run this directly in a terminal window, not via a pipe or redirect.",
    );
  }
  const rl = createInterface({ input: stdin, output: stdout });
  return rl.question(question).finally(() => rl.close());
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Summarise the document so you can sanity-check you pulled the right file.
 *
 * Both call sites pass the raw API response (not the cache wrapper), and the
 * response nests its page tree at `document.children` - the outer `document` is
 * the file wrapper and holds name/version/styles; its `children` are the CANVAS
 * pages. Passing the cache wrapper here instead silently yields "Pages: 0".
 */
function summarise(doc) {
  const pages = doc?.document?.children ?? [];

  const lines = [];
  lines.push(`  File name:  ${doc?.name ?? "(unknown)"}`);
  if (doc?.lastModified) lines.push(`  Modified:   ${doc.lastModified}`);
  if (doc?.version) lines.push(`  Version:    ${doc.version}`);
  lines.push(`  Pages:      ${pages.length}`);

  const pageNames = pages.map((c) => c.name);
  if (pageNames.length) lines.push(`  Page names: ${pageNames.join(", ")}`);

  // Count frames per page so a 0 here means the key points at an empty file.
  for (const page of pages) {
    const frames = (page.children ?? []).length;
    lines.push(`    - ${page.name}: ${frames} top-level layer(s)`);
  }

  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const positional = args.filter((a) => !a.startsWith("--"));

  const fileKey = parseFileKey(positional[0] ?? "");
  if (!fileKey) {
    console.error(
      "Could not read a Figma file key.\n" +
        "Pass a full URL or bare key, e.g.\n" +
        '  node scripts/figma-fetch.mjs "https://www.figma.com/design/AbCdEf123/my-portfolio"',
    );
    process.exitCode = 1;
    return;
  }

  // Cache hit: serve it without spending a rate-limit request.
  if (!force && (await fileExists(OUT_FILE))) {
    try {
      const cached = JSON.parse(await readFile(OUT_FILE, "utf8"));
      if (cached.key === fileKey) {
        console.log(`Using cached export (no API call spent):\n${OUT_FILE}\n`);
        console.log(summarise(cached.document));
        console.log("\nDelete the file or pass --force to refresh.");
        return;
      }
      console.log("Cached export is for a different file key; refetching.\n");
    } catch {
      // Corrupt cache - fall through and refetch.
    }
  }

  console.log("Figma file key:", fileKey);
  console.log(
    "\nYour token is read once, used in memory, and never written to disk.\n" +
      "Paste it below (input is invisible - press Enter after).",
  );

  const token = (await prompt("Personal access token: ")).trim();
  if (!token) {
    console.error("No token entered. Aborting.");
    process.exitCode = 1;
    return;
  }

  // Depth controls how far Figma expands the tree:
//   depth=2 -> pages + top-level layers only (no text nodes, fills or styles)
//   depth=N -> N levels of children
//   omitted -> whole tree (default; large files can be tens of MB)
  const depthArg = positional.find((a) => /^--depth=\d+$/.test(a));
  const depth = depthArg ? depthArg.split("=")[1] : null;
  const query = depth ? `?depth=${depth}` : "";
  const url = `https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}${query}`;

  if (depthArg) {
    console.log(`Depth: ${depth} (partial export - some children omitted)`);
  }

  let response;
  try {
    response = await fetch(url, {
      headers: { "X-Figma-Token": token },
    });
  } catch (err) {
    console.error(`Network error talking to Figma: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (!response.ok) {
    console.error(`Figma returned HTTP ${response.status} ${response.statusText}`);

    if (response.status === 403) {
      console.error(
        "\nThat is a permissions problem, not a token problem. Usual causes:\n" +
          "  - The file is in a team/org you do not have API access to\n" +
          "  - The token lacks the File content scope\n" +
          "  - The file is not shared with your account",
      );
    }
    if (response.status === 404) {
      console.error("\nCheck the file key - it may have been copied from a different tab.");
    }
    if (response.status === 429) {
      const retry = response.headers.get("retry-after");
      console.error(
        `\nRate limited. Figma's free Starter plan allows very few file reads per month.\n` +
          (retry ? `Retry after: ${retry}s\n` : "") +
          `Any previously cached export is still usable.`,
      );
    }

    process.exitCode = 1;
    return;
  }

  const doc = await response.json();

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    OUT_FILE,
    JSON.stringify({ key: fileKey, fetchedAt: new Date().toISOString(), document: doc }, null, 2),
    "utf8",
  );

  console.log(`\nSaved to ${OUT_FILE}\n`);
  console.log(summarise(doc));
}

main().catch((err) => {
  console.error(`Unexpected failure: ${err.message}`);
  process.exitCode = 1;
});