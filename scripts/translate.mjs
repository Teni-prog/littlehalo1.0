// Reads messages/en.json, translates every string leaf to French (Canadian)
// via the DeepL free API, and writes messages/fr.json with the same shape.
//
// Usage: node scripts/translate.mjs
// Requires DEEPL_API_KEY in .env.local.

import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EN_PATH = path.join(ROOT, "messages", "en.json");
const FR_PATH = path.join(ROOT, "messages", "fr.json");
const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";
const BATCH_SIZE = 50;

function loadEnvLocal() {
  try {
    const content = readFileSync(path.join(ROOT, ".env.local"), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2] ?? "";
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value.trim();
    }
  } catch {
    // .env.local not found — rely on already-exported environment variables
  }
}

// ICU messages can contain argument syntax like "{count, plural, one {# sitter} other {# sitters}}".
// Plural/select arguments nest braces inside braces, so a naive non-nesting regex mis-splits
// them — it was sending fragments like "{count, plural, one " to DeepL as if they were plain
// text, which translated the ICU keywords themselves ("count" -> "nombre", "plural" ->
// "pluriel", etc.) and corrupted the message. This tokenizer walks the string with explicit
// brace-depth tracking so nested plural/select blocks are parsed correctly: the argument name,
// format keyword, and branch keys (one/other/=0/...) are kept as untouched "icu" segments,
// while the literal text INSIDE each branch (e.g. "sitter" in "{# sitter}") is still sent to
// DeepL for translation.
function findMatchingBrace(str, openIndex) {
  let depth = 1;
  let i = openIndex + 1;
  while (i < str.length && depth > 0) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") depth--;
    i++;
  }
  return i - 1; // index of the matching '}'
}

function splitTopLevel(str, sep) {
  const parts = [];
  let depth = 0;
  let buf = "";
  for (const ch of str) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (ch === sep && depth === 0) {
      parts.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  parts.push(buf);
  return parts;
}

const PLURAL_FORMATS = new Set(["plural", "select", "selectordinal"]);

function tokenizeIcuBlock(block) {
  // block includes the surrounding { }
  const inner = block.slice(1, -1);
  const parts = splitTopLevel(inner, ",");
  const format = parts[1]?.trim();

  if (parts.length < 3 || !PLURAL_FORMATS.has(format)) {
    // Simple argument ({name}, {count, number}, {date, date, long}, ...) — leave untouched.
    return [{ type: "icu", value: block }];
  }

  // plural/select: parts[0]=argName, parts[1]=format, remainder holds "key {branch} key {branch} ..."
  const branchesStr = parts.slice(2).join(",");
  const segments = [{ type: "icu", value: `{${parts[0]},${parts[1]},` }];

  let i = 0;
  while (i < branchesStr.length) {
    const braceIdx = branchesStr.indexOf("{", i);
    if (braceIdx === -1) {
      segments.push({ type: "icu", value: branchesStr.slice(i) });
      break;
    }
    // Everything between the last position and this '{' is the branch key (e.g. "one", "=0"),
    // plus whatever whitespace separates branches — keep verbatim, it's ICU syntax, not prose.
    segments.push({ type: "icu", value: branchesStr.slice(i, braceIdx + 1) });
    const closeIdx = findMatchingBrace(branchesStr, braceIdx);
    const content = branchesStr.slice(braceIdx + 1, closeIdx);
    segments.push(...tokenize(content)); // branch content may itself contain plain text + nested args
    segments.push({ type: "icu", value: "}" });
    i = closeIdx + 1;
  }

  segments.push({ type: "icu", value: "}" });
  return segments;
}

function tokenize(text) {
  const segments = [];
  let textBuf = "";
  let i = 0;
  const flush = () => {
    if (textBuf.length > 0) {
      segments.push({ type: "text", value: textBuf });
      textBuf = "";
    }
  };
  while (i < text.length) {
    if (text[i] === "{") {
      const closeIdx = findMatchingBrace(text, i);
      if (closeIdx >= text.length) {
        // Unbalanced brace — treat rest as plain text rather than crash.
        textBuf += text.slice(i);
        break;
      }
      flush();
      segments.push(...tokenizeIcuBlock(text.slice(i, closeIdx + 1)));
      i = closeIdx + 1;
    } else {
      textBuf += text[i];
      i++;
    }
  }
  flush();
  return segments;
}

function splitIcu(text) {
  return tokenize(text);
}

function collectLeaves(node, pathParts, out) {
  if (typeof node === "string") {
    out.push({ path: pathParts, text: node });
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      collectLeaves(value, [...pathParts, key], out);
    }
  }
}

function setAtPath(root, pathParts, value) {
  let node = root;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const key = pathParts[i];
    if (!(key in node)) node[key] = {};
    node = node[key];
  }
  node[pathParts[pathParts.length - 1]] = value;
}

async function translateBatch(texts, apiKey) {
  if (texts.length === 0) return [];

  const params = new URLSearchParams();
  params.set("target_lang", "FR-CA");
  for (const text of texts) params.append("text", text);

  const res = await fetch(DEEPL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL API error ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.translations.map((t) => t.text);
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error("DEEPL_API_KEY is not set (checked process.env and .env.local).");
    process.exit(1);
  }

  const en = JSON.parse(await readFile(EN_PATH, "utf8"));

  const leaves = [];
  collectLeaves(en, [], leaves);
  console.log(`Found ${leaves.length} strings to translate.`);

  // Flatten each leaf into its ICU-safe text segments, tracking which leaf/segment
  // each translatable chunk belongs to so results can be spliced back together.
  const leafSegments = leaves.map((leaf) => splitIcu(leaf.text));
  const translatableChunks = [];
  leafSegments.forEach((segments, leafIndex) => {
    segments.forEach((segment, segmentIndex) => {
      if (segment.type === "text" && segment.value.trim().length > 0) {
        translatableChunks.push({ leafIndex, segmentIndex, value: segment.value });
      }
    });
  });

  console.log(
    `Translating ${translatableChunks.length} text segments in batches of ${BATCH_SIZE}...`
  );

  for (let i = 0; i < translatableChunks.length; i += BATCH_SIZE) {
    const batch = translatableChunks.slice(i, i + BATCH_SIZE);
    const translations = await translateBatch(batch.map((c) => c.value), apiKey);
    batch.forEach((chunk, j) => {
      leafSegments[chunk.leafIndex][chunk.segmentIndex].value = translations[j];
    });
    console.log(
      `  translated ${Math.min(i + BATCH_SIZE, translatableChunks.length)}/${translatableChunks.length}`
    );
  }

  const fr = {};
  leaves.forEach((leaf, i) => {
    const text = leafSegments[i].map((s) => s.value).join("");
    setAtPath(fr, leaf.path, text);
  });

  await writeFile(FR_PATH, JSON.stringify(fr, null, 2) + "\n", "utf8");
  console.log(`Wrote ${FR_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
